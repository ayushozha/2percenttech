package httpapi

import (
	"errors"
	"log"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/ayushozha/2percenttech/api/internal/store"
	"github.com/ayushozha/2percenttech/api/internal/upstream"
)

const (
	accessCookie  = "tt_access"
	refreshCookie = "tt_refresh"
)

/* ---- cookies ------------------------------------------------------------ */

// The site and this API share the 2percenttech.com registrable domain, so the
// cookies are same-site and SameSite=Lax is enough; the requests are still
// cross-origin, which is what the CORS credentials handling above covers.
func (s *Server) setSessionCookies(w http.ResponseWriter, t *upstream.AuthResponse) {
	accessMaxAge := t.ExpiresIn
	if accessMaxAge <= 0 {
		accessMaxAge = int((15 * time.Minute).Seconds())
	}
	s.setCookie(w, accessCookie, t.AccessToken, accessMaxAge)
	if t.RefreshToken != "" {
		s.setCookie(w, refreshCookie, t.RefreshToken, int((7 * 24 * time.Hour).Seconds()))
	}
}

func (s *Server) setCookie(w http.ResponseWriter, name, value string, maxAge int) {
	http.SetCookie(w, &http.Cookie{
		Name:     name,
		Value:    value,
		Path:     "/",
		Domain:   s.cfg.CookieDomain,
		MaxAge:   maxAge,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	})
}

func (s *Server) clearSessionCookies(w http.ResponseWriter) {
	for _, n := range []string{accessCookie, refreshCookie} {
		http.SetCookie(w, &http.Cookie{
			Name: n, Value: "", Path: "/", Domain: s.cfg.CookieDomain,
			MaxAge: -1, HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode,
		})
	}
}

/* ---- handlers ----------------------------------------------------------- */

type signupRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

func (s *Server) handleSignup(w http.ResponseWriter, r *http.Request) {
	var req signupRequest
	if !decodeJSON(w, r, &req) {
		return
	}

	req.Name = strings.TrimSpace(req.Name)
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if !validEmail(req.Email) {
		writeError(w, http.StatusBadRequest, "email", "enter a valid email address")
		return
	}
	if req.Name == "" {
		writeError(w, http.StatusBadRequest, "name", "enter your name")
		return
	}
	if len(req.Password) < 8 {
		writeError(w, http.StatusBadRequest, "short", "use at least 8 characters")
		return
	}

	// admin is never self-assignable; anything unrecognised falls to
	// participant rather than being rejected, so a stale client cannot lock
	// people out of signing up.
	role := store.Role(req.Role)
	if !store.SelfAssignableRoles[role] {
		role = store.RoleParticipant
	}

	tokens, err := s.auth.Signup(r.Context(), req.Email, req.Password, req.Name, clientIP(r))
	if err != nil {
		writeAuthError(w, err, "signup")
		return
	}

	user, err := s.store.UpsertUser(r.Context(), tokens.User.ID, req.Email, req.Name, role)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not create your account")
		return
	}

	s.setSessionCookies(w, tokens)
	writeJSON(w, http.StatusCreated, user)
}

type loginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *Server) handleLogin(w http.ResponseWriter, r *http.Request) {
	var req loginRequest
	if !decodeJSON(w, r, &req) {
		return
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	if !validEmail(req.Email) {
		writeError(w, http.StatusBadRequest, "email", "enter a valid email address")
		return
	}

	tokens, err := s.auth.Login(r.Context(), req.Email, req.Password, clientIP(r))
	if err != nil {
		writeAuthError(w, err, "login")
		return
	}
	if tokens.RequiresTwoFA {
		writeError(w, http.StatusNotImplemented, "two_factor_required",
			"this account has two-factor authentication enabled, which this site does not support yet")
		return
	}

	// An account can exist upstream without a row here — it was created before
	// this service, or the row insert failed after signup. Default it to
	// participant rather than refusing the sign-in.
	user, err := s.store.UserByAuthID(r.Context(), tokens.User.ID)
	if errors.Is(err, store.ErrNotFound) {
		name := tokens.User.DisplayName
		if name == "" {
			name = req.Email
		}
		user, err = s.store.UpsertUser(r.Context(), tokens.User.ID, req.Email, name, store.RoleParticipant)
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not load your account")
		return
	}

	s.setSessionCookies(w, tokens)
	writeJSON(w, http.StatusOK, user)
}

func (s *Server) handleLogout(w http.ResponseWriter, r *http.Request) {
	if c, err := r.Cookie(refreshCookie); err == nil && c.Value != "" {
		// Revoking upstream is what actually ends the session; a failure here
		// still clears the browser's copy, so report success either way.
		if err := s.auth.Logout(r.Context(), c.Value, clientIP(r)); err != nil {
			_ = err
		}
	}
	s.clearSessionCookies(w)
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

// handleMe is the session probe the site calls on load. A missing or expired
// session is a 200 with a null body, not a 401: "signed out" is an ordinary
// answer to "who am I", and the frontend renders a gate rather than an error.
func (s *Server) handleMe(w http.ResponseWriter, r *http.Request) {
	user, err := s.resolveUser(w, r)
	if err != nil || user == nil {
		writeJSON(w, http.StatusOK, nil)
		return
	}
	writeJSON(w, http.StatusOK, user)
}

func (s *Server) handleForgotPassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email string `json:"email"`
	}
	if !decodeJSON(w, r, &req) {
		return
	}
	// Deliberately unconditional: revealing whether an address is registered
	// would turn this into an account-enumeration oracle.
	_ = s.auth.ForgotPassword(r.Context(), strings.ToLower(strings.TrimSpace(req.Email)), clientIP(r))
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (s *Server) handleResetPassword(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Token       string `json:"token"`
		NewPassword string `json:"new_password"`
	}
	if !decodeJSON(w, r, &req) {
		return
	}
	if req.Token == "" {
		writeError(w, http.StatusBadRequest, "invalid_request", "this reset link is missing its token")
		return
	}
	if len(req.NewPassword) < 8 {
		writeError(w, http.StatusBadRequest, "short", "use at least 8 characters")
		return
	}
	if err := s.auth.ResetPassword(r.Context(), req.Token, req.NewPassword, clientIP(r)); err != nil {
		writeAuthError(w, err, "reset")
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

/* ---- error mapping ------------------------------------------------------ */

// writeAuthError translates an upstream failure into the discriminated set the
// frontend renders messages for.
//
// It keys on auth_code, which is a stable enum. The service's "error" field
// looks like a code but is a human sentence, and "code" is too coarse to
// separate a bad email from a bad password — both arrive as invalid_signup.
func writeAuthError(w http.ResponseWriter, err error, flow string) {
	var ae *upstream.Error
	if !errors.As(err, &ae) {
		log.Printf("auth %s: transport failure: %v", flow, err)
		writeError(w, http.StatusBadGateway, "server_error", "the sign-in service is unavailable")
		return
	}

	switch ae.AuthCode {
	case "AUTH_INVALID_EMAIL":
		writeError(w, http.StatusBadRequest, "email", "enter a valid email address")
	case "AUTH_EMAIL_EXISTS":
		writeError(w, http.StatusConflict, "taken", "that email is already registered")
	case "AUTH_PASSWORD_REQUIREMENTS", "AUTH_WEAK_PASSWORD":
		// The upstream sentence is the specific reason — too short, contains
		// your name, too common — and is worth more than a generic message.
		writeError(w, http.StatusBadRequest, "short", firstNonEmpty(ae.UserMessage, ae.Message,
			"choose a stronger password"))
	case "AUTH_INVALID_CREDENTIALS":
		writeError(w, http.StatusUnauthorized, "nomatch", "email and password do not match")
	case "AUTH_EMAIL_NOT_CONFIGURED":
		writeError(w, http.StatusServiceUnavailable, "email_unavailable",
			"we cannot send email yet, so this cannot be completed")
	default:
		switch ae.Status {
		case http.StatusTooManyRequests:
			writeError(w, http.StatusTooManyRequests, "rate_limited", "too many attempts, try again later")
		case http.StatusUnauthorized:
			writeError(w, http.StatusUnauthorized, "nomatch", "email and password do not match")
		default:
			// Unmapped. Log the upstream identifiers — without this an
			// unrecognised rejection is a 502 with nothing to debug from.
			log.Printf("auth %s: unmapped upstream error: %v", flow, ae)
			writeError(w, http.StatusBadGateway, "server_error", "could not complete "+flow)
		}
	}
}

func firstNonEmpty(vals ...string) string {
	for _, v := range vals {
		if strings.TrimSpace(v) != "" {
			return v
		}
	}
	return ""
}

func validEmail(addr string) bool {
	if addr == "" || len(addr) > 320 || !strings.Contains(addr, ".") {
		return false
	}
	_, err := mail.ParseAddress(addr)
	return err == nil
}
