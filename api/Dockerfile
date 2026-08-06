# Build context is ./api (Coolify base directory), so everything the build
# needs lives under this directory — the Next.js site above it is not copied.

FROM golang:1.25-alpine AS build
WORKDIR /src

# Dependencies first so a source-only change reuses this layer.
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/server

FROM alpine:3.21
RUN apk add --no-cache ca-certificates wget \
    && adduser -D -u 10001 app
COPY --from=build /out/api /usr/local/bin/api

USER app
EXPOSE 8091
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:8091/health >/dev/null || exit 1

CMD ["/usr/local/bin/api"]
