// Package httpapi is the service's HTTP surface. Its routes mirror the
// functions in the site's lib/store.ts one-for-one, so the frontend swap from
// localStorage to fetch is mechanical.
package httpapi

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/ayushozha/2percenttech/api/internal/config"
	"github.com/ayushozha/2percenttech/api/internal/jwtvalidator"
	"github.com/ayushozha/2percenttech/api/internal/store"
	"github.com/ayushozha/2percenttech/api/internal/upstream"
)

type Server struct {
	cfg       *config.Config
	store     *store.Store
	auth      *upstream.AuthClient
	waitlist  *upstream.WaitlistClient
	validator *jwtvalidator.Validator
}

func New(cfg *config.Config, st *store.Store, auth *upstream.AuthClient,
	wl *upstream.WaitlistClient, v *jwtvalidator.Validator) *Server {
	return &Server{cfg: cfg, store: st, auth: auth, waitlist: wl, validator: v}
}

func (s *Server) Routes() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", s.handleHealth)

	// Auth. Public by necessity — these are how a session is obtained.
	mux.HandleFunc("POST /api/auth/signup", s.handleSignup)
	mux.HandleFunc("POST /api/auth/login", s.handleLogin)
	mux.HandleFunc("POST /api/auth/logout", s.handleLogout)
	mux.HandleFunc("GET /api/auth/me", s.handleMe)
	mux.HandleFunc("POST /api/auth/forgot-password", s.handleForgotPassword)
	mux.HandleFunc("POST /api/auth/reset-password", s.handleResetPassword)

	// Leads. Creating one is public — it is the site's contact form.
	// Reading and working them is staff-only.
	mux.HandleFunc("POST /api/leads", s.handleCreateLead)
	mux.Handle("GET /api/leads", s.requireRole(store.RoleAdmin, store.RoleOrganizer)(http.HandlerFunc(s.handleListLeads)))
	mux.Handle("PATCH /api/leads/{id}/status", s.requireRole(store.RoleAdmin, store.RoleOrganizer)(http.HandlerFunc(s.handleCycleLeadStatus)))

	mux.Handle("GET /api/users", s.requireRole(store.RoleAdmin)(http.HandlerFunc(s.handleListUsers)))

	mux.Handle("GET /api/submissions", s.requireSession(http.HandlerFunc(s.handleListSubmissions)))
	mux.Handle("POST /api/submissions", s.requireRole(store.RoleParticipant)(http.HandlerFunc(s.handleCreateSubmission)))
	mux.Handle("PUT /api/submissions/{id}/score", s.requireRole(store.RoleJudge)(http.HandlerFunc(s.handleSetScore)))

	return s.withCORS(mux)
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	if err := s.store.Ping(r.Context()); err != nil {
		writeError(w, http.StatusServiceUnavailable, "database_unavailable", "database is unreachable")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

/* ---- response helpers --------------------------------------------------- */

func writeJSON(w http.ResponseWriter, status int, body any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(body); err != nil {
		log.Printf("write response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]string{"error": code, "message": message})
}

// decodeJSON reads a bounded request body. The cap is generous for these forms
// and exists so a malformed or hostile request cannot buffer without limit.
func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) bool {
	defer r.Body.Close()
	dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 64<<10))
	if err := dec.Decode(dst); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_request", "request body is not valid JSON")
		return false
	}
	return true
}
