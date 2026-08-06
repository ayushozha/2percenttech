package store

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
)

var ErrNotFound = errors.New("not found")

/* ---- users -------------------------------------------------------------- */

// UpsertUser records the app-side row for an authentication-service identity.
// The role is only applied on first insert: a later sign-in must never be able
// to change a role, or anyone could re-register their way to organizer.
func (s *Store) UpsertUser(ctx context.Context, authUserID, email, name string, role Role) (*User, error) {
	const q = `
        INSERT INTO users (auth_user_id, email, display_name, role)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (auth_user_id) DO UPDATE
           SET email        = EXCLUDED.email,
               display_name = CASE WHEN EXCLUDED.display_name <> ''
                                   THEN EXCLUDED.display_name
                                   ELSE users.display_name END,
               updated_at   = now()
        RETURNING id, auth_user_id, display_name, email, role`
	var u User
	err := s.pool.QueryRow(ctx, q, authUserID, strings.ToLower(email), name, string(role)).
		Scan(&u.ID, &u.AuthUserID, &u.Name, &u.Email, &u.Role)
	if err != nil {
		return nil, fmt.Errorf("upsert user: %w", err)
	}
	return &u, nil
}

func (s *Store) UserByAuthID(ctx context.Context, authUserID string) (*User, error) {
	const q = `SELECT id, auth_user_id, display_name, email, role
                 FROM users WHERE auth_user_id = $1`
	var u User
	err := s.pool.QueryRow(ctx, q, authUserID).
		Scan(&u.ID, &u.AuthUserID, &u.Name, &u.Email, &u.Role)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("load user: %w", err)
	}
	return &u, nil
}

func (s *Store) ListUsers(ctx context.Context) ([]User, error) {
	const q = `SELECT id, auth_user_id, display_name, email, role
                 FROM users ORDER BY created_at`
	rows, err := s.pool.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("list users: %w", err)
	}
	defer rows.Close()

	out := []User{}
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.AuthUserID, &u.Name, &u.Email, &u.Role); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	return out, rows.Err()
}

/* ---- leads -------------------------------------------------------------- */

func (s *Store) CreateLead(ctx context.Context, l *Lead) (*Lead, error) {
	const q = `
        INSERT INTO leads (kind, email, company, contact, audience, dates,
                           attendance, budget, message,
                           picks, goals, needs, media, access, packages)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        RETURNING id, created_at`
	var createdAt time.Time
	err := s.pool.QueryRow(ctx, q,
		l.Kind, strings.ToLower(strings.TrimSpace(l.Email)), l.Company, l.Contact,
		l.Audience, l.Dates, l.Attendance, l.Budget, l.Message,
		nonNil(l.Picks), nonNil(l.Goals), nonNil(l.Needs),
		nonNil(l.Media), nonNil(l.Access), nonNil(l.Packages),
	).Scan(&l.ID, &createdAt)
	if err != nil {
		return nil, fmt.Errorf("create lead: %w", err)
	}
	l.TS = isoOrEmpty(createdAt)
	l.Status = "new"
	return l, nil
}

const leadColumns = `id, kind, status, email, company, contact, audience, dates,
                     attendance, budget, message, picks, goals, needs, media,
                     access, packages, created_at`

func scanLead(row pgx.Row) (*Lead, error) {
	var l Lead
	var createdAt time.Time
	err := row.Scan(&l.ID, &l.Kind, &l.Status, &l.Email, &l.Company, &l.Contact,
		&l.Audience, &l.Dates, &l.Attendance, &l.Budget, &l.Message,
		&l.Picks, &l.Goals, &l.Needs, &l.Media, &l.Access, &l.Packages, &createdAt)
	if err != nil {
		return nil, err
	}
	l.TS = isoOrEmpty(createdAt)
	return &l, nil
}

func (s *Store) ListLeads(ctx context.Context) ([]Lead, error) {
	rows, err := s.pool.Query(ctx, `SELECT `+leadColumns+` FROM leads ORDER BY created_at DESC`)
	if err != nil {
		return nil, fmt.Errorf("list leads: %w", err)
	}
	defer rows.Close()

	out := []Lead{}
	for rows.Next() {
		l, err := scanLead(rows)
		if err != nil {
			return nil, err
		}
		out = append(out, *l)
	}
	return out, rows.Err()
}

// CycleLeadStatus advances new -> contacted -> closed -> new and returns the
// updated row. The rotation lives in SQL so two dashboards racing on the same
// lead cannot both read `new` and both write `contacted`.
func (s *Store) CycleLeadStatus(ctx context.Context, id string) (*Lead, error) {
	const q = `
        UPDATE leads
           SET status = CASE status
                          WHEN 'new'       THEN 'contacted'
                          WHEN 'contacted' THEN 'closed'
                          ELSE 'new'
                        END
         WHERE id = $1
        RETURNING ` + leadColumns
	l, err := scanLead(s.pool.QueryRow(ctx, q, id))
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("cycle lead status: %w", err)
	}
	return l, nil
}

/* ---- submissions and scores --------------------------------------------- */

// ListSubmissions returns every entry with its scores keyed by judge email.
// Scores come back in one pass rather than per-submission to keep this a
// two-query read no matter how many entries there are.
func (s *Store) ListSubmissions(ctx context.Context) ([]Submission, error) {
	const q = `
        SELECT s.id, s.team, s.project, s.track, s.description,
               COALESCE(o.email, '')
          FROM submissions s
          LEFT JOIN users o ON o.id = s.owner_user_id
         ORDER BY s.created_at`
	rows, err := s.pool.Query(ctx, q)
	if err != nil {
		return nil, fmt.Errorf("list submissions: %w", err)
	}
	defer rows.Close()

	out := []Submission{}
	byID := map[string]int{}
	for rows.Next() {
		var sub Submission
		if err := rows.Scan(&sub.ID, &sub.Team, &sub.Project, &sub.Track, &sub.Desc, &sub.Owner); err != nil {
			return nil, err
		}
		sub.Scores = map[string]int{}
		byID[sub.ID] = len(out)
		out = append(out, sub)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	scoreRows, err := s.pool.Query(ctx,
		`SELECT sc.submission_id, u.email, sc.score
           FROM scores sc JOIN users u ON u.id = sc.judge_user_id`)
	if err != nil {
		return nil, fmt.Errorf("list scores: %w", err)
	}
	defer scoreRows.Close()

	for scoreRows.Next() {
		var subID, judgeEmail string
		var score int
		if err := scoreRows.Scan(&subID, &judgeEmail, &score); err != nil {
			return nil, err
		}
		if i, ok := byID[subID]; ok {
			out[i].Scores[judgeEmail] = score
		}
	}
	return out, scoreRows.Err()
}

func (s *Store) CreateSubmission(ctx context.Context, ownerUserID, team, project, desc string) (*Submission, error) {
	const q = `
        INSERT INTO submissions (owner_user_id, team, project, description)
        VALUES ($1,$2,$3,$4)
        RETURNING id, team, project, track, description`
	var sub Submission
	err := s.pool.QueryRow(ctx, q, ownerUserID, team, project, desc).
		Scan(&sub.ID, &sub.Team, &sub.Project, &sub.Track, &sub.Desc)
	if err != nil {
		return nil, fmt.Errorf("create submission: %w", err)
	}
	sub.Scores = map[string]int{}
	return &sub, nil
}

func (s *Store) HasSubmission(ctx context.Context, ownerUserID string) (bool, error) {
	var n int
	err := s.pool.QueryRow(ctx,
		`SELECT count(*) FROM submissions WHERE owner_user_id = $1`, ownerUserID).Scan(&n)
	return n > 0, err
}

func (s *Store) SetScore(ctx context.Context, submissionID, judgeUserID string, score int) error {
	const q = `
        INSERT INTO scores (submission_id, judge_user_id, score)
        VALUES ($1,$2,$3)
        ON CONFLICT (submission_id, judge_user_id)
        DO UPDATE SET score = EXCLUDED.score, updated_at = now()`
	tag, err := s.pool.Exec(ctx, q, submissionID, judgeUserID, score)
	if err != nil {
		// A missing submission surfaces as a foreign-key violation; report it
		// as "not found" rather than a 500.
		if strings.Contains(err.Error(), "scores_submission_id_fkey") {
			return ErrNotFound
		}
		return fmt.Errorf("set score: %w", err)
	}
	if tag.RowsAffected() == 0 {
		return ErrNotFound
	}
	return nil
}

// nonNil keeps a nil slice out of the driver: Postgres TEXT[] columns are
// NOT NULL DEFAULT '{}' and a nil would be written as NULL.
func nonNil(v []string) []string {
	if v == nil {
		return []string{}
	}
	return v
}
