package httpapi

import (
	"net/http"
	"strings"
	"time"

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
	Lang     string                 `json:"lang"`
	Messages []upstream.ChatMessage `json:"messages"`
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

	reply, err := s.agent.Chat(r.Context(), req.Lang, req.Messages)
	if err != nil {
		writeError(w, http.StatusBadGateway, "concierge_error", "could not reach the concierge")
		return
	}

	writeJSON(w, http.StatusOK, map[string]string{"reply": reply})
}
