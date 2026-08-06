// Package upstream wraps the two other services this API talks to.
package upstream

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// AuthClient calls the dedicated authentication-service instance. The API key
// lives here and only here — the browser never sees it, which is the whole
// reason auth is proxied rather than called directly from the site.
type AuthClient struct {
	baseURL string
	apiKey  string
	http    *http.Client
}

func NewAuthClient(baseURL, apiKey string) *AuthClient {
	return &AuthClient{
		baseURL: baseURL,
		apiKey:  apiKey,
		http:    &http.Client{Timeout: 15 * time.Second},
	}
}

// AuthResponse is the subset of the service's response we act on.
type AuthResponse struct {
	AccessToken   string `json:"access_token"`
	RefreshToken  string `json:"refresh_token"`
	ExpiresIn     int    `json:"expires_in"`
	RequiresTwoFA bool   `json:"requires_2fa"`
	User          struct {
		ID            string `json:"id"`
		Email         string `json:"email"`
		DisplayName   string `json:"display_name"`
		EmailVerified bool   `json:"email_verified"`
	} `json:"user"`
}

// Error carries the upstream status and error code so handlers can map them to
// the discriminated codes the frontend already renders.
type Error struct {
	Status  int
	Code    string `json:"error"`
	Message string `json:"message"`
}

func (e *Error) Error() string {
	return fmt.Sprintf("auth service %d %s: %s", e.Status, e.Code, e.Message)
}

// Signup and Login both take the end user's IP. The auth service rate-limits
// signup 5/hour and login 10/15min *per IP*, and trusts X-Forwarded-For — so
// without forwarding it every user of the site would share one bucket keyed to
// this container.
func (c *AuthClient) Signup(ctx context.Context, email, password, displayName, clientIP string) (*AuthResponse, error) {
	return c.post(ctx, "/api/auth/signup", map[string]any{
		"email":           email,
		"password":        password,
		"display_name":    displayName,
		"token_transport": "json",
	}, clientIP)
}

func (c *AuthClient) Login(ctx context.Context, email, password, clientIP string) (*AuthResponse, error) {
	return c.post(ctx, "/api/auth/login", map[string]any{
		"email":           email,
		"password":        password,
		"token_transport": "json",
	}, clientIP)
}

func (c *AuthClient) Refresh(ctx context.Context, refreshToken, clientIP string) (*AuthResponse, error) {
	return c.post(ctx, "/api/auth/refresh", map[string]any{
		"refresh_token":   refreshToken,
		"token_transport": "json",
	}, clientIP)
}

func (c *AuthClient) Logout(ctx context.Context, refreshToken, clientIP string) error {
	_, err := c.post(ctx, "/api/auth/logout", map[string]any{"refresh_token": refreshToken}, clientIP)
	return err
}

func (c *AuthClient) ForgotPassword(ctx context.Context, email, clientIP string) error {
	_, err := c.post(ctx, "/api/auth/forgot-password", map[string]any{"email": email}, clientIP)
	return err
}

func (c *AuthClient) ResetPassword(ctx context.Context, token, newPassword, clientIP string) error {
	_, err := c.post(ctx, "/api/auth/reset-password", map[string]any{
		"token":        token,
		"new_password": newPassword,
	}, clientIP)
	return err
}

func (c *AuthClient) post(ctx context.Context, path string, body map[string]any, clientIP string) (*AuthResponse, error) {
	payload, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+path, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", c.apiKey)
	if clientIP != "" {
		req.Header.Set("X-Forwarded-For", clientIP)
	}

	resp, err := c.http.Do(req)
	if err != nil {
		return nil, fmt.Errorf("call auth service: %w", err)
	}
	defer resp.Body.Close()

	raw, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		e := &Error{Status: resp.StatusCode}
		_ = json.Unmarshal(raw, e)
		return nil, e
	}

	var out AuthResponse
	if err := json.Unmarshal(raw, &out); err != nil {
		return nil, fmt.Errorf("decode auth response: %w", err)
	}
	return &out, nil
}
