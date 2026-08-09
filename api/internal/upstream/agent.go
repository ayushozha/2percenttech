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

// AgentClient calls the internal AI concierge microservice (see /agent at the
// repo root). It holds a shared secret, never an OpenAI key — that lives only
// in the agent service's own environment, one hop further from the browser
// than this API already is. The browser talks to this API; this API talks to
// the agent service; only the agent service talks to OpenAI.
type AgentClient struct {
	baseURL   string
	secretKey string
	http      *http.Client
}

// NewAgentClient returns nil when the service is not configured, which
// callers treat as "the concierge isn't available yet" rather than an
// error — the same convention NewWaitlistClient uses for its own optional
// upstream.
func NewAgentClient(baseURL, secretKey string) *AgentClient {
	if baseURL == "" || secretKey == "" {
		return nil
	}
	return &AgentClient{
		baseURL:   baseURL,
		secretKey: secretKey,
		// A real chat completion can take several seconds; generous but
		// bounded so a stuck upstream can't hold a request open forever.
		http: &http.Client{Timeout: 25 * time.Second},
	}
}

// ChatMessage mirrors the shape both the browser and the agent service speak,
// so the app API can pass requests through without reshaping them.
type ChatMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// Chat forwards a conversation to the agent service and returns its reply.
func (c *AgentClient) Chat(ctx context.Context, lang string, messages []ChatMessage) (string, error) {
	payload, err := json.Marshal(map[string]any{"lang": lang, "messages": messages})
	if err != nil {
		return "", fmt.Errorf("encode request: %w", err)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.baseURL+"/chat", bytes.NewReader(payload))
	if err != nil {
		return "", fmt.Errorf("build request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Internal-Key", c.secretKey)

	resp, err := c.http.Do(req)
	if err != nil {
		return "", fmt.Errorf("call agent service: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 4<<10))
		return "", fmt.Errorf("agent service returned %d: %s", resp.StatusCode, body)
	}

	var out struct {
		Reply string `json:"reply"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&out); err != nil {
		return "", fmt.Errorf("decode response: %w", err)
	}
	return out.Reply, nil
}
