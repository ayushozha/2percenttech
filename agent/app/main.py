"""2%Tech event concierge — the AI backend for the bright-theme landing
page's chat widget (components/BrightConcierge.tsx).

This service is internal-only by design: it carries no public hostname in
Coolify, and the only client it accepts calls from is the app API (see
api/internal/upstream/agent.go), authenticated with a shared secret in the
X-Internal-Key header. The OpenAI key lives here and only here — never in the
browser, and never in the app API either, which just proxies the browser's
request one hop further in.
"""

import os
from typing import Literal

from fastapi import FastAPI, Header, HTTPException
from openai import AsyncOpenAI, OpenAIError
from pydantic import BaseModel, Field

from .prompts import system_prompt

MAX_MESSAGES = 20
MAX_MESSAGE_LEN = 2000


def env(name: str, default: str = "", required: bool = False) -> str:
    """Mirrors config.Load()'s env() in the Go API: read once at import time
    so a missing required value fails the process at startup, not the first
    request that happens to need it."""
    value = os.environ.get(name, default).strip()
    if required and not value:
        raise RuntimeError(f"{name} is required")
    return value


OPENAI_API_KEY = env("OPENAI_API_KEY", required=True)
# Overridable without a code change — pin a different model by redeploying
# with a new env var, not a new image.
OPENAI_MODEL = env("OPENAI_MODEL", "gpt-4o-mini")
# Shared secret the app API sends on every call. This service has no other
# access control — see the README for why that's an acceptable amount of
# protection for something with no public hostname.
AGENT_SECRET_KEY = env("AGENT_SECRET_KEY", required=True)

client = AsyncOpenAI(api_key=OPENAI_API_KEY, timeout=20.0)

app = FastAPI(title="2%Tech concierge", docs_url=None, redoc_url=None)


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=MAX_MESSAGE_LEN)


class ChatRequest(BaseModel):
    lang: Literal["en", "zh"] = "en"
    messages: list[ChatMessage] = Field(min_length=1, max_length=MAX_MESSAGES)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/chat")
async def chat(req: ChatRequest, x_internal_key: str = Header(default="")):
    # FastAPI maps the x_internal_key parameter to the X-Internal-Key header
    # automatically (underscores -> hyphens). Constant-time comparison isn't
    # worth it here: this guards against calls from outside the private
    # network, not a timing attack against a colocated service.
    if not AGENT_SECRET_KEY or x_internal_key != AGENT_SECRET_KEY:
        raise HTTPException(status_code=401, detail="unauthorized")

    try:
        completion = await client.chat.completions.create(
            model=OPENAI_MODEL,
            max_tokens=400,
            messages=[
                {"role": "system", "content": system_prompt(req.lang)},
                *[{"role": m.role, "content": m.content} for m in req.messages],
            ],
        )
    except OpenAIError as exc:
        # The app API maps any non-200 here to its own generic
        # "could not reach the concierge" — detail is for our own logs via
        # Coolify, not for the browser to ever see.
        raise HTTPException(status_code=502, detail=f"upstream error: {exc}") from exc

    reply = (completion.choices[0].message.content or "").strip()
    if not reply:
        raise HTTPException(status_code=502, detail="empty completion")

    return {"reply": reply}
