// Package config loads the service's settings from the environment.
//
// Everything is read once at startup so a missing required value fails the
// process rather than the first request that happens to need it.
package config

import (
	"fmt"
	"os"
	"strings"
)

type Config struct {
	DatabaseURL string
	Port        string

	// The dedicated authentication-service instance this API proxies to.
	AuthBaseURL  string
	AuthAPIKey   string
	AuthClientID string

	// Where the proxied auth calls actually go. Traefik overwrites
	// X-Forwarded-For on anything it forwards — it trusts no upstream by
	// default — so a signup routed through the public hostname reaches the auth
	// service carrying the Docker gateway's address instead of the visitor's.
	// Its signup and login limits are per-IP, so that would put every visitor
	// in one bucket and break signup site-wide after five attempts an hour.
	// Going container-to-container on the private network preserves the header.
	// Falls back to AuthBaseURL when unset.
	AuthInternalURL string

	// The dedicated email-waitlist instance lead emails are mirrored into.
	// Optional: with no key configured the mirror is skipped, not failed.
	WaitlistBaseURL   string
	WaitlistSecretKey string

	// The internal AI concierge microservice (see /agent) that backs the
	// bright-theme landing page's chat widget. Internal-only by design — it
	// carries no public hostname, and this is the only client it accepts
	// calls from. Optional, same convention as the waitlist mirror: with
	// nothing configured, the concierge endpoint answers "not configured"
	// rather than failing this service's boot.
	AgentBaseURL   string
	AgentSecretKey string

	// Cookies are issued on the parent domain so the static site on
	// 2percenttech.com sends them to api.2percenttech.com.
	CookieDomain string

	AllowedOrigins []string
}

func Load() (*Config, error) {
	c := &Config{
		DatabaseURL:       env("DATABASE_URL", ""),
		Port:              env("PORT", "8091"),
		AuthBaseURL:       strings.TrimRight(env("AUTH_BASE_URL", ""), "/"),
		AuthInternalURL:   strings.TrimRight(env("AUTH_INTERNAL_URL", ""), "/"),
		AuthAPIKey:        env("AUTH_API_KEY", ""),
		AuthClientID:      env("AUTH_CLIENT_ID", ""),
		WaitlistBaseURL:   strings.TrimRight(env("WAITLIST_BASE_URL", ""), "/"),
		WaitlistSecretKey: env("WAITLIST_SECRET_KEY", ""),
		AgentBaseURL:      strings.TrimRight(env("AGENT_BASE_URL", ""), "/"),
		AgentSecretKey:    env("AGENT_SECRET_KEY", ""),
		CookieDomain:      env("COOKIE_DOMAIN", ".2percenttech.com"),
	}

	for _, o := range strings.Split(env("ALLOWED_ORIGINS", ""), ",") {
		if o = strings.TrimSpace(o); o != "" {
			c.AllowedOrigins = append(c.AllowedOrigins, o)
		}
	}

	// These four have no sensible default: without them the service can only
	// return errors, so fail loudly at boot instead.
	for _, m := range []struct {
		name string
		val  string
	}{
		{"DATABASE_URL", c.DatabaseURL},
		{"AUTH_BASE_URL", c.AuthBaseURL},
		{"AUTH_API_KEY", c.AuthAPIKey},
		{"AUTH_CLIENT_ID", c.AuthClientID},
	} {
		if m.val == "" {
			return nil, fmt.Errorf("%s is required", m.name)
		}
	}

	if len(c.AllowedOrigins) == 0 {
		return nil, fmt.Errorf("ALLOWED_ORIGINS is required (credentialed CORS cannot use a wildcard)")
	}

	return c, nil
}

// AuthCallURL is the origin for proxied auth requests. See AuthInternalURL.
func (c *Config) AuthCallURL() string {
	if c.AuthInternalURL != "" {
		return c.AuthInternalURL
	}
	return c.AuthBaseURL
}

// JWKSURL is where access tokens minted for this client are verified against.
// Deliberately the public origin: key material is worth fetching over TLS, and
// this call carries no client IP for anything to get wrong.
func (c *Config) JWKSURL() string {
	return c.AuthBaseURL + "/.well-known/jwks.json"
}

func env(key, fallback string) string {
	if v := strings.TrimSpace(os.Getenv(key)); v != "" {
		return v
	}
	return fallback
}
