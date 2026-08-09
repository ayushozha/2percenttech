# 2% Tech application API

The Go service behind `api.2percenttech.com`. It owns the data the shared
microservices do not model, and fronts the authentication service so the browser
never holds an API key or a raw token.

| Lives here | Lives elsewhere |
|---|---|
| Enquiries (host + sponsor) and their new → contacted → closed workflow | Identity, passwords, sessions — `authservice.2percenttech.com` |
| Hackathon entries and judge scores | The mailing list — `emailwaitlist.2percenttech.com` |
| The role attached to each account | Pageviews — `analytics.2percenttech.com` |

Roles live here because the authentication service has no writable per-user role
field; its `role` column is always the literal `user`. Every request resolves its
role from `users` in this database, so a role can never arrive from the client.

## Why the site can stay static

The site is a Next.js static export served by nginx. Because this API is a
separate service rather than Next.js route handlers, that build model is
untouched — the browser calls `api.2percenttech.com` directly and the site ships
no server code.

## Run it

```bash
go build ./... && go vet ./...
go run ./cmd/server
```

There is no local Go dependency on the auth service: `internal/jwtvalidator` is
**vendored** from `ayushozha/authentication-service`. It is copied rather than
imported because that repo's `go.mod` declares module
`github.com/Ayush10/authentication-service`, which does not match its GitHub
path, so `go get` cannot resolve it. Re-copy those three files if upstream
changes.

## Configuration

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | `twopct_app` on `projects-db` |
| `AUTH_BASE_URL` | yes | `https://authservice.2percenttech.com` — public origin, used for JWKS |
| `AUTH_INTERNAL_URL` | no | Container-to-container origin for proxied auth calls, e.g. `http://twopct-authservice:8080`. See the note below — without it, per-IP rate limiting collapses onto one bucket. |
| `AUTH_API_KEY` | yes | The 2% Tech client key. Server-side only — never ship it to a browser. |
| `AUTH_CLIENT_ID` | yes | Client UUID; JWTs are rejected unless their `client_id` claim matches |
| `ALLOWED_ORIGINS` | yes | Comma-separated. Credentialed CORS cannot use a wildcard, so each origin is named. |
| `WAITLIST_BASE_URL` | no | Unset disables the mailing-list mirror rather than failing it |
| `WAITLIST_SECRET_KEY` | no | The `wl_sec_…` key |
| `AGENT_BASE_URL` | no | Internal origin of the concierge agent service, e.g. `http://twopct-agent:8092`. Unset answers the concierge endpoint with `503 concierge_unavailable` rather than failing this service's boot — see `../agent/README.md`. |
| `AGENT_SECRET_KEY` | no (required if `AGENT_BASE_URL` is set) | Shared secret sent as `X-Internal-Key` on every call to the agent service. Must match that service's own `AGENT_SECRET_KEY` exactly. |
| `COOKIE_DOMAIN` | no | Defaults to `.2percenttech.com` |
| `PORT` | no | Defaults to `8091` |

The schema is applied on every boot from one idempotent block in
`internal/store/store.go`. There is no migration table and no manual step.

## Routes

Each mirrors a function in the site's `lib/store.ts`.

| Method | Path | Who |
|---|---|---|
| `POST` | `/api/auth/signup`, `/api/auth/login` | public |
| `POST` | `/api/auth/logout` | public |
| `GET` | `/api/auth/me` | anyone — returns `null` when signed out |
| `POST` | `/api/auth/forgot-password`, `/api/auth/reset-password` | public |
| `POST` | `/api/leads` | **public** — this is the site's contact form |
| `GET` | `/api/leads` | admin, organizer |
| `PATCH` | `/api/leads/{id}/status` | admin, organizer |
| `GET` | `/api/users` | admin |
| `GET` | `/api/submissions` | any signed-in account |
| `POST` | `/api/submissions` | participant |
| `PUT` | `/api/submissions/{id}/score` | judge |
| `POST` | `/api/concierge/chat` | **public**, rate-limited 12 msgs / 10 min per IP — the homepage's chat widget, proxied to `../agent` |

## Two things worth knowing

**The end user's IP is forwarded upstream, and it must not go through Traefik.**
The auth service rate-limits signup at 5/hour and login at 10/15min *per IP*, and
reads the IP from `X-Forwarded-For`. Traefik trusts no upstream by default, so it
**overwrites** that header on anything it forwards: routed through the public
hostname, every signup arrives at the auth service carrying the Docker gateway's
address (`10.0.1.1`), every visitor lands in the same bucket, and the sixth
signup of the hour fails for everyone. `AUTH_INTERNAL_URL` points these calls at
the auth container directly over the private `coolify` network, which preserves
the header. The auth app carries a stable Docker network alias
(`twopct-authservice`, set as Coolify's `custom_network_aliases`) so the target
survives redeploys — its container name does not.

**The waitlist mirror is best effort and must stay that way.** A lead is durable
once it is in `leads`; the mirror runs on its own context afterwards. If the
waitlist service is slow or down, the enquiry still succeeds — losing the mailing
list copy is recoverable by re-exporting from this database, losing the lead is
not. A `409` from that service means the address is already subscribed, which is
a normal outcome for a repeat enquirer, not an error.

## The concierge agent is a third proxied service, deliberately shaped like the first two

`POST /api/concierge/chat` doesn't call OpenAI itself — it forwards to the
internal agent service in `../agent`, the same shape as the auth proxy:
the thing holding the actual third-party key is one hop further from the
browser than this API is. Two differences from the auth and waitlist proxies:

- **It's optional at boot, not required.** `upstream.NewAgentClient` returns
  `nil` when `AGENT_BASE_URL`/`AGENT_SECRET_KEY` aren't set, and the handler
  answers `503 concierge_unavailable` rather than this service failing to
  start — deploying this API and deploying the agent service are two
  separate steps, and the frontend already has a canned fallback for the
  concierge being unavailable.
- **It's rate-limited here, not just validated.** Every other public write
  (`/api/leads`, auth) has an upstream service enforcing its own limits or
  costs nothing per call. A chat message costs an OpenAI call, so this
  service enforces its own per-IP cap (`ratelimit.go`, in-memory, 12
  requests / 10 minutes) independent of whatever the agent service does —
  it shouldn't be the only thing standing between the public internet and
  an unbounded OpenAI bill.
