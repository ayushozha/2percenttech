package upstream

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

// WaitlistClient mirrors lead email addresses into the dedicated email-waitlist
// instance, which is what gives 2% Tech a deduplicated, CSV-exportable list.
//
// The app database remains the source of truth for a lead: the waitlist service
// has no update endpoint (so it cannot carry the new/contacted/closed workflow)
// and holds one record per email per project, which a host lead and a sponsor
// lead from the same address would collide on.
type WaitlistClient struct {
	baseURL   string
	secretKey string
	http      *http.Client
}

// NewWaitlistClient returns nil when the instance is not configured, which
// callers treat as "skip the mirror" rather than an error.
func NewWaitlistClient(baseURL, secretKey string) *WaitlistClient {
	if baseURL == "" || secretKey == "" {
		return nil
	}
	return &WaitlistClient{
		baseURL:   baseURL,
		secretKey: secretKey,
		http:      &http.Client{Timeout: 10 * time.Second},
	}
}

// Subscribe is best effort by contract. A failure here must never fail the
// lead it came from: the lead is already durably stored, and losing the mailing
// list copy is recoverable by re-exporting from the app database.
func (c *WaitlistClient) Subscribe(ctx context.Context, email string, metadata map[string]any) {
	if c == nil {
		return
	}

	payload, err := json.Marshal(map[string]any{"email": email, "metadata": metadata})
	if err != nil {
		log.Printf("waitlist mirror: encode %s: %v", email, err)
		return
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/api/v1/subscribe", bytes.NewReader(payload))
	if err != nil {
		log.Printf("waitlist mirror: build request %s: %v", email, err)
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-Key", c.secretKey)

	resp, err := c.http.Do(req)
	if err != nil {
		log.Printf("waitlist mirror: %s: %v", email, err)
		return
	}
	defer resp.Body.Close()

	switch {
	case resp.StatusCode == http.StatusConflict:
		// Already on the list. Normal for a repeat enquirer, not a failure.
	case resp.StatusCode >= 400:
		log.Printf("waitlist mirror: %s: upstream returned %d", email, resp.StatusCode)
	}
}
