# 2% Tech concierge agent

The AI backend for the homepage's chat widget (`components/BrightConcierge.tsx`).
A small FastAPI service that holds the OpenAI key and nothing else.

## Why this is a separate service, not a route on the Go API

The Go API (`../api`) already fronts one upstream (the auth service) so the
browser never holds an API key. This follows the same shape for a second key:

```
browser → app API (api.2percenttech.com) → this service (internal only) → OpenAI
```

The app API already owns CORS, per-IP rate limiting and request validation
for everything public; this service adds nothing on top except the one thing
that's actually new here — talking to OpenAI. It has **no public hostname**.
Give it a Coolify app with no domain attached and a stable
`custom_network_aliases` entry (`twopct-agent`, matching the `twopct-authservice`
convention in `../api/README.md`) so `AGENT_BASE_URL` in the Go API can name it
directly over the private network.

## Run it locally

```bash
cd agent
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in OPENAI_API_KEY and AGENT_SECRET_KEY
export $(grep -v '^#' .env | xargs)
uvicorn app.main:app --reload --port 8092
```

Then point the Go API at it locally: `AGENT_BASE_URL=http://localhost:8092`,
`AGENT_SECRET_KEY=` (same value as this service's).

```bash
curl -s localhost:8092/chat \
  -H "X-Internal-Key: $AGENT_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"lang":"en","messages":[{"role":"user","content":"I want to run a hackathon"}]}'
```

## Configuration

| Variable | Required | Purpose |
|---|---|---|
| `OPENAI_API_KEY` | yes | Never logged, never returned in a response, never present anywhere in the Next.js site or the Go API. |
| `AGENT_SECRET_KEY` | yes | Shared secret checked against the `X-Internal-Key` header. Must match the Go API's `AGENT_SECRET_KEY` exactly. |
| `OPENAI_MODEL` | no | Defaults to `gpt-4o-mini`. Change by redeploying with a new env var, not a code change. |
| `PORT` | no | Defaults to `8092`. |

## Why a shared secret is enough protection here

This service has no public hostname and answers only on the private Docker
network, so `X-Internal-Key` isn't the only thing standing between it and the
open internet — Traefik never routes anything to it in the first place. The
header exists so that if the network boundary is ever misconfigured (a stray
public domain, a network alias reused by something else), an unauthenticated
caller still can't spend the OpenAI budget through it.

## Request/response shape

`POST /chat`, header `X-Internal-Key: <AGENT_SECRET_KEY>`:

```json
{ "lang": "en", "messages": [{ "role": "user", "content": "…" }] }
```

→ `200 { "reply": "…" }`, or a non-200 with a `detail` field on any failure
(bad auth, OpenAI error, empty completion). The Go API maps every non-200
here to its own generic `concierge_error` — this service's `detail` is for
Coolify's logs, not for the browser.

`messages` carries the whole conversation so far (`user`/`assistant` turns,
system prompt is added here); the caller resends it every turn rather than
this service holding any state. Capped at 20 messages / 2000 chars each —
enforced again here even though the Go API already trims to the same bounds,
since this service shouldn't assume it's only ever called by that one client.

## What this doesn't do (yet)

The chat is pure intake — it asks its questions and recaps them at the end,
but nothing here writes a `Lead` row the way the landing page's request form
does (`POST /api/leads` in the Go API). Turning "the model thinks it has
collected format/timing/size/goal/name/email" into an actual lead record is a
reasonable follow-up, not yet built: it needs the model to emit something
structured at the end of intake rather than prose, and a decision about what
happens if it recaps early or gets contradicted later in the conversation.
