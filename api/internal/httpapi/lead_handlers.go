package httpapi

import (
	"context"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/ayushozha/2percenttech/api/internal/store"
)

type leadRequest struct {
	Kind string `json:"kind"`

	Email   string `json:"email"`
	Company string `json:"company"`
	Contact string `json:"contact"`
	Message string `json:"message"`
	Budget  string `json:"budget"`

	// host
	Picks      []string `json:"picks"`
	Audience   string   `json:"audience"`
	Dates      string   `json:"dates"`
	Attendance string   `json:"attendance"`
	Needs      []string `json:"needs"`
	Media      []string `json:"media"`
	Access     []string `json:"access"`

	// sponsor
	Packages []string `json:"packages"`
	Goals    []string `json:"goals"`
}

// handleCreateLead is the one write path open to the public: it backs both the
// landing page's host-request form and /sponsor/apply.
func (s *Server) handleCreateLead(w http.ResponseWriter, r *http.Request) {
	var req leadRequest
	if !decodeJSON(w, r, &req) {
		return
	}

	if req.Kind != "host" && req.Kind != "sponsor" {
		writeError(w, http.StatusBadRequest, "kind", "unknown enquiry type")
		return
	}
	email := strings.ToLower(strings.TrimSpace(req.Email))
	if !validEmail(email) {
		writeError(w, http.StatusBadRequest, "email", "enter a valid email address")
		return
	}

	// The two forms ask for different things; enforce each one's own minimum
	// rather than a single shared rule that would be wrong for both.
	switch req.Kind {
	case "host":
		if len(req.Picks) == 0 {
			writeError(w, http.StatusBadRequest, "picks", "choose at least one format")
			return
		}
	case "sponsor":
		if len(req.Packages) == 0 {
			writeError(w, http.StatusBadRequest, "packages", "choose at least one package")
			return
		}
		if strings.TrimSpace(req.Company) == "" {
			writeError(w, http.StatusBadRequest, "company", "tell us which company you're with")
			return
		}
		if strings.TrimSpace(req.Contact) == "" {
			writeError(w, http.StatusBadRequest, "contact", "tell us who you are")
			return
		}
	}

	lead := &store.Lead{
		Kind:       req.Kind,
		Email:      email,
		Company:    strings.TrimSpace(req.Company),
		Contact:    strings.TrimSpace(req.Contact),
		Audience:   strings.TrimSpace(req.Audience),
		Dates:      strings.TrimSpace(req.Dates),
		Attendance: req.Attendance,
		Budget:     req.Budget,
		Message:    strings.TrimSpace(req.Message),
		Picks:      req.Picks,
		Goals:      req.Goals,
		Needs:      req.Needs,
		Media:      req.Media,
		Access:     req.Access,
		Packages:   req.Packages,
	}

	saved, err := s.store.CreateLead(r.Context(), lead)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not record your enquiry")
		return
	}

	// The lead is safe at this point. Mirroring it onto the mailing list runs
	// on its own context so a slow or down waitlist service cannot make the
	// visitor wait, and cannot fail a request that has already succeeded.
	go func(email, kind, company string) {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		s.waitlist.Subscribe(ctx, email, map[string]any{
			"source":  "2percenttech.com",
			"kind":    kind,
			"company": company,
		})
	}(saved.Email, saved.Kind, saved.Company)

	writeJSON(w, http.StatusCreated, saved)
}

func (s *Server) handleListLeads(w http.ResponseWriter, r *http.Request) {
	leads, err := s.store.ListLeads(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not load enquiries")
		return
	}
	writeJSON(w, http.StatusOK, leads)
}

func (s *Server) handleCycleLeadStatus(w http.ResponseWriter, r *http.Request) {
	lead, err := s.store.CycleLeadStatus(r.Context(), r.PathValue("id"))
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "no such enquiry")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not update the enquiry")
		return
	}
	writeJSON(w, http.StatusOK, lead)
}

func (s *Server) handleListUsers(w http.ResponseWriter, r *http.Request) {
	users, err := s.store.ListUsers(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not load accounts")
		return
	}
	writeJSON(w, http.StatusOK, users)
}
