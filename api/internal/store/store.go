// Package store owns the twopct_app database: the connection pool, the schema,
// and every query the API makes.
package store

import (
	"context"
	"fmt"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Store struct{ pool *pgxpool.Pool }

func New(ctx context.Context, databaseURL string) (*Store, error) {
	cfg, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, fmt.Errorf("parse DATABASE_URL: %w", err)
	}
	cfg.MaxConns = 20
	cfg.MinConns = 2
	cfg.MaxConnLifetime = time.Hour

	pool, err := pgxpool.NewWithConfig(ctx, cfg)
	if err != nil {
		return nil, fmt.Errorf("connect: %w", err)
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("ping: %w", err)
	}
	return &Store{pool: pool}, nil
}

func (s *Store) Close() { s.pool.Close() }

func (s *Store) Ping(ctx context.Context) error { return s.pool.Ping(ctx) }

// schema is applied on every boot. Every statement is idempotent, so this is
// both the initial install and the upgrade path — the same approach the
// email-waitlist service uses, and the reason there is no migration table.
const schema = `
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- The authentication service owns identity; this is its user id (JWT sub).
    -- Roles live here because that service has no writable per-user role field.
    auth_user_id  UUID NOT NULL UNIQUE,
    email         TEXT NOT NULL,
    display_name  TEXT NOT NULL DEFAULT '',
    role          TEXT NOT NULL DEFAULT 'participant'
                  CHECK (role IN ('admin','organizer','judge','participant')),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (LOWER(email));

CREATE TABLE IF NOT EXISTS leads (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind        TEXT NOT NULL CHECK (kind IN ('host','sponsor')),
    status      TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','closed')),
    email       TEXT NOT NULL,
    company     TEXT NOT NULL DEFAULT '',
    contact     TEXT NOT NULL DEFAULT '',
    audience    TEXT NOT NULL DEFAULT '',
    dates       TEXT NOT NULL DEFAULT '',
    attendance  TEXT NOT NULL DEFAULT '',
    budget      TEXT NOT NULL DEFAULT '',
    message     TEXT NOT NULL DEFAULT '',
    picks       TEXT[] NOT NULL DEFAULT '{}',
    goals       TEXT[] NOT NULL DEFAULT '{}',
    needs       TEXT[] NOT NULL DEFAULT '{}',
    media       TEXT[] NOT NULL DEFAULT '{}',
    access      TEXT[] NOT NULL DEFAULT '{}',
    packages    TEXT[] NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);

-- One row per concierge chat conversation, upserted on every turn. This is
-- the raw capture ("store it somewhere so it can be wired properly later"):
-- the full transcript plus the model's structured extraction of the intake
-- fields. When an intake completes with an email, a row in leads is created
-- and linked via lead_id so the two pipelines meet in the dashboard.
CREATE TABLE IF NOT EXISTS concierge_intakes (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id  TEXT NOT NULL UNIQUE,
    lang             TEXT NOT NULL DEFAULT 'en',
    transcript       JSONB NOT NULL DEFAULT '[]',
    event_format     TEXT NOT NULL DEFAULT '',
    timing           TEXT NOT NULL DEFAULT '',
    audience_size    TEXT NOT NULL DEFAULT '',
    goal             TEXT NOT NULL DEFAULT '',
    contact_name     TEXT NOT NULL DEFAULT '',
    email            TEXT NOT NULL DEFAULT '',
    complete         BOOLEAN NOT NULL DEFAULT FALSE,
    lead_id          UUID REFERENCES leads(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS concierge_intakes_created_at_idx ON concierge_intakes (created_at DESC);

CREATE TABLE IF NOT EXISTS submissions (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
    team           TEXT NOT NULL,
    project        TEXT NOT NULL,
    track          TEXT NOT NULL DEFAULT 'Open',
    description    TEXT NOT NULL DEFAULT '',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS submissions_owner_idx ON submissions (owner_user_id);

CREATE TABLE IF NOT EXISTS scores (
    submission_id  UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    judge_user_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score          INT NOT NULL CHECK (score BETWEEN 1 AND 10),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (submission_id, judge_user_id)
);
`

func (s *Store) Migrate(ctx context.Context) error {
	if _, err := s.pool.Exec(ctx, schema); err != nil {
		return fmt.Errorf("apply schema: %w", err)
	}
	return nil
}
