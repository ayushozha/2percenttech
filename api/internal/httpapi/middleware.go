package httpapi

import (
	"context"
	"errors"
	"net"
	"net/http"
	"slices"
	"strings"

	"github.com/ayushozha/2percenttech/api/internal/store"
)

type ctxKey string

const userKey ctxKey = "app_user"

// currentUser returns the caller established by requireSession/requireRole.
func currentUser(ctx context.Context) *store.User {
	u, _ := ctx.Value(userKey).(*store.User)
	return u
}

/* ---- CORS --------------------------------------------------------------- */

// withCORS answers preflights and echoes an allowed origin. Credentials are in
// play (the session cookies), so the origin must be named exactly — a wildcard
// is not permitted with Access-Control-Allow-Credentials.
func (s *Server) withCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" && slices.Contains(s.cfg.AllowedOrigins, origin) {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Set("Vary", "Origin")
		}

		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
			w.Header().Set("Access-Control-Max-Age", "600")
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

/* ---- session ------------------------------------------------------------ */

var errNoSession = errors.New("no session")

// resolveUser validates the access cookie and, if it has expired, spends the
// refresh cookie once to mint a new pair. That keeps a 15-minute access token
// invisible to the user across a longer sitting.
//
// The role attached to the returned user always comes from our own database.
// The access token's own `role` claim is ignored — the auth service has no
// writable per-user role, so it is always the literal string "user".
func (s *Server) resolveUser(w http.ResponseWriter, r *http.Request) (*store.User, error) {
	if c, err := r.Cookie(accessCookie); err == nil && c.Value != "" {
		if claims, err := s.validator.Validate(c.Value); err == nil {
			return s.userFor(r.Context(), claims.UserID())
		}
	}

	refresh, err := r.Cookie(refreshCookie)
	if err != nil || refresh.Value == "" {
		return nil, errNoSession
	}

	tokens, err := s.auth.Refresh(r.Context(), refresh.Value, clientIP(r))
	if err != nil {
		s.clearSessionCookies(w)
		return nil, errNoSession
	}

	claims, err := s.validator.Validate(tokens.AccessToken)
	if err != nil {
		s.clearSessionCookies(w)
		return nil, errNoSession
	}

	s.setSessionCookies(w, tokens)
	return s.userFor(r.Context(), claims.UserID())
}

func (s *Server) userFor(ctx context.Context, authUserID string) (*store.User, error) {
	u, err := s.store.UserByAuthID(ctx, authUserID)
	if errors.Is(err, store.ErrNotFound) {
		return nil, errNoSession
	}
	return u, err
}

func (s *Server) requireSession(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u, err := s.resolveUser(w, r)
		if err != nil || u == nil {
			writeError(w, http.StatusUnauthorized, "unauthenticated", "sign in to continue")
			return
		}
		next.ServeHTTP(w, r.WithContext(context.WithValue(r.Context(), userKey, u)))
	})
}

// requireRole is the actual access control. The dashboard's TABS_BY_ROLE only
// decides what to draw; this decides what may be read and written.
func (s *Server) requireRole(roles ...store.Role) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return s.requireSession(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			u := currentUser(r.Context())
			if u == nil || !slices.Contains(roles, u.Role) {
				writeError(w, http.StatusForbidden, "forbidden", "your account cannot access this")
				return
			}
			next.ServeHTTP(w, r)
		}))
	}
}

/* ---- client address ----------------------------------------------------- */

// clientIP recovers the end user's address from behind Traefik so it can be
// forwarded to the auth service, whose signup and login limits are per-IP.
func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if first, _, ok := strings.Cut(xff, ","); ok {
			return strings.TrimSpace(first)
		}
		return strings.TrimSpace(xff)
	}
	if xr := r.Header.Get("X-Real-IP"); xr != "" {
		return strings.TrimSpace(xr)
	}
	if host, _, err := net.SplitHostPort(r.RemoteAddr); err == nil {
		return host
	}
	return r.RemoteAddr
}
