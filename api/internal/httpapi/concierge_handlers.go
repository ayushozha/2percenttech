package httpapi

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/ayushozha/2percenttech/api/internal/store"
	"github.com/ayushozha/2percenttech/api/internal/upstream"
)

// conciergeLimiter caps the landing page's chat widget at 12 messages per
// visitor every 10 minutes — generous for one real conversation, tight
// enough that a script can't run up the OpenAI bill behind it.
var conciergeLimiter = newIPLimiter(12, 10*time.Minute)

const (
	// Bounds what gets forwarded to the agent service, independent of
	// whatever limits it enforces itself — this API shouldn't trust a
	// downstream service to be the only thing standing between the public
	// internet and an unbounded OpenAI bill.
	conciergeMaxMessages   = 20
	conciergeMaxMessageLen = 2000
)

type conciergeChatRequest struct {
	// ConversationID is minted by the widget (crypto.randomUUID) when a chat
	// opens and resent on every turn, so the turns of one conversation land
	// on one concierge_intakes row. Optional: without it the chat still
	// works, it just isn't persisted.
	ConversationID string                 `json:"conversation_id"`
	Lang           string                 `json:"lang"`
	Messages       []upstream.ChatMessage `json:"messages"`
}

// handleConciergeChat backs the bright-theme landing page's chat widget.
//
// It answers 503 rather than erroring when the concierge microservice isn't
// configured (s.agent == nil) — deploying this API and deploying the agent
// service are two separate steps, and the frontend already has a canned
// fallback for exactly this case, the same way it does for a network failure.
func (s *Server) handleConciergeChat(w http.ResponseWriter, r *http.Request) {
	if s.agent == nil {
		writeError(w, http.StatusServiceUnavailable, "concierge_unavailable", "the concierge isn't available right now")
		return
	}

	if !conciergeLimiter.allow(clientIP(r)) {
		writeError(w, http.StatusTooManyRequests, "rate_limited", "slow down a little and try again shortly")
		return
	}

	var req conciergeChatRequest
	if !decodeJSON(w, r, &req) {
		return
	}

	if req.Lang != "zh" {
		req.Lang = "en"
	}
	if len(req.Messages) == 0 {
		writeError(w, http.StatusBadRequest, "messages", "say something first")
		return
	}
	if len(req.Messages) > conciergeMaxMessages {
		// Keep the most recent turns — they carry more of the actual
		// conversation than the opening messages do.
		req.Messages = req.Messages[len(req.Messages)-conciergeMaxMessages:]
	}
	for i, m := range req.Messages {
		if m.Role != "user" && m.Role != "assistant" {
			writeError(w, http.StatusBadRequest, "messages", "invalid message role")
			return
		}
		content := strings.TrimSpace(m.Content)
		if len(content) > conciergeMaxMessageLen {
			content = content[:conciergeMaxMessageLen]
		}
		req.Messages[i].Content = content
	}

	reply, intake, err := s.agent.Chat(r.Context(), req.Lang, req.Messages)
	if err != nil {
		writeError(w, http.StatusBadGateway, "concierge_error", "could not reach the concierge")
		return
	}

	// Persistence rides behind the reply and never blocks or fails it: the
	// visitor already has their answer, and losing one turn of storage is
	// strictly better than turning a working chat into an error. The full
	// transcript is resent every turn, so the next turn heals any gap.
	if convID := strings.TrimSpace(req.ConversationID); convID != "" && len(convID) <= 64 {
		transcript := append(req.Messages, upstream.ChatMessage{Role: "assistant", Content: reply})
		go s.persistConciergeTurn(convID, req.Lang, transcript, intake)
	}

	writeJSON(w, http.StatusOK, map[string]string{"reply": reply})
}

// persistConciergeTurn upserts the conversation's row and, the first time an
// intake is complete with a usable email, files it as a real host lead — the
// same pipeline the request form feeds, so the dashboard and the two-working-
// days promise the bot makes both actually mean something.
func (s *Server) persistConciergeTurn(convID, lang string, transcript []upstream.ChatMessage, intake upstream.Intake) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	raw, err := json.Marshal(transcript)
	if err != nil {
		log.Printf("concierge intake %s: encode transcript: %v", convID, err)
		return
	}

	intakeID, leadID, err := s.store.UpsertConciergeIntake(ctx, &store.ConciergeIntake{
		ConversationID: convID,
		Lang:           lang,
		Transcript:     raw,
		EventFormat:    intake.Format,
		Timing:         intake.Timing,
		AudienceSize:   intake.AudienceSize,
		Goal:           intake.Goal,
		ContactName:    intake.Name,
		Email:          intake.Email,
		Complete:       intake.Complete,
	})
	if err != nil {
		log.Printf("concierge intake %s: %v", convID, err)
		return
	}

	email := strings.ToLower(strings.TrimSpace(intake.Email))
	if !intake.Complete || leadID != "" || !validEmail(email) {
		return
	}

	picks := []string{}
	if f := strings.ToLower(strings.TrimSpace(intake.Format)); f != "" {
		picks = append(picks, f)
	}
	lead, err := s.store.CreateLead(ctx, &store.Lead{
		Kind:       "host",
		Email:      email,
		Contact:    strings.TrimSpace(intake.Name),
		Dates:      strings.TrimSpace(intake.Timing),
		Attendance: strings.TrimSpace(intake.AudienceSize),
		Message:    "Via concierge chat. Goal: " + strings.TrimSpace(intake.Goal),
		Picks:      picks,
	})
	if err != nil {
		log.Printf("concierge intake %s: create lead: %v", convID, err)
		return
	}
	if won, err := s.store.LinkConciergeLead(ctx, intakeID, lead.ID); err != nil {
		log.Printf("concierge intake %s: %v", convID, err)
	} else if won {
		log.Printf("concierge intake %s: filed host lead %s", convID, lead.ID)
	}
}
