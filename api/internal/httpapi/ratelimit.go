package httpapi

import (
	"sync"
	"time"
)

// ipLimiter is a small in-memory per-IP rate limiter for endpoints that carry
// a real per-request cost — currently just the concierge, which spends an
// OpenAI call per message. Fixed-window rather than a token bucket: simple,
// and the concierge's traffic doesn't need anything smarter.
//
// State is process-local. That's fine for the single instance this API runs
// as; a second instance would double the effective limit per visitor, which
// is an acceptable failure mode for an abuse guard, not a correctness one.
type ipLimiter struct {
	mu       sync.Mutex
	limit    int
	window   time.Duration
	visitors map[string]*visitorWindow
}

type visitorWindow struct {
	count int
	since time.Time
}

func newIPLimiter(limit int, window time.Duration) *ipLimiter {
	l := &ipLimiter{limit: limit, window: window, visitors: make(map[string]*visitorWindow)}
	go l.evictStale()
	return l
}

// allow reports whether ip may make another request in the current window,
// counting this call toward the total if so.
func (l *ipLimiter) allow(ip string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()

	now := time.Now()
	v, ok := l.visitors[ip]
	if !ok || now.Sub(v.since) > l.window {
		l.visitors[ip] = &visitorWindow{count: 1, since: now}
		return true
	}
	if v.count >= l.limit {
		return false
	}
	v.count++
	return true
}

// evictStale keeps process memory from growing with every distinct visitor
// the API has ever seen, not just the currently rate-limited ones.
func (l *ipLimiter) evictStale() {
	for range time.Tick(10 * time.Minute) {
		l.mu.Lock()
		for ip, v := range l.visitors {
			if time.Since(v.since) > l.window {
				delete(l.visitors, ip)
			}
		}
		l.mu.Unlock()
	}
}
