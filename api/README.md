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
| `AUTH_BASE_URL` | yes | `https://authservice.2percenttech.com` |
| `AUTH_API_KEY` | yes | The 2% Tech client key. Server-side only — never ship it to a browser. |
| `AUTH_CLIENT_ID` | yes | Client UUID; JWTs are rejected unless their `client_id` claim matches |
| `ALLOWED_ORIGINS` | yes | Comma-separated. Credentialed CORS cannot use a wildcard, so each origin is named. |
| `WAITLIST_BASE_URL` | no | Unset disables the mailing-list mirror rather than failing it |
| `WAITLIST_SECRET_KEY` | no | The `wl_sec_…` key |
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

## Two things worth knowing

**The end user's IP is forwarded upstream.** The auth service rate-limits signup
at 5/hour and login at 10/15min *per IP*. Without `X-Forwarded-For` on the
proxied call, every visitor would share one bucket keyed to this container and
the sixth signup of the hour would fail for everyone.

**The waitlist mirror is best effort and must stay that way.** A lead is durable
once it is in `leads`; the mirror runs on its own context afterwards. If the
waitlist service is slow or down, the enquiry still succeeds — losing the mailing
list copy is recoverable by re-exporting from this database, losing the lead is
not. A `409` from that service means the address is already subscribed, which is
a normal outcome for a repeat enquirer, not an error.
