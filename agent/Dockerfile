# Build context is ./agent (Coolify base directory, same convention as
# ../api/Dockerfile) — the Next.js site and the Go API above it are not
# copied into this image.

FROM python:3.12-slim AS base
WORKDIR /app

# Dependencies first so a source-only change reuses this layer.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN useradd --uid 10001 --create-home --shell /usr/sbin/nologin app
USER app

# No EXPOSE'd port is baked in as a hard default the way the Go API's is —
# uvicorn binds to $PORT at container start so this stays consistent with
# config.go's env("PORT", "8091") pattern one directory up.
ENV PORT=8092
EXPOSE 8092

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import os,urllib.request; urllib.request.urlopen(f'http://127.0.0.1:{os.environ.get(\"PORT\",\"8092\")}/health')" || exit 1

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8092}"]
