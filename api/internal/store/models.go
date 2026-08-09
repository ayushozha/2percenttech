package store

import "time"

// The JSON tags on these types are the wire contract with the frontend: they
// mirror the shapes in the site's lib/types.ts so `lib/store.ts` could swap its
// localStorage bodies for fetch calls without any caller changing.

type Role string

const (
	RoleAdmin       Role = "admin"
	RoleOrganizer   Role = "organizer"
	RoleJudge       Role = "judge"
	RoleParticipant Role = "participant"
)

// SelfAssignableRoles is what a person may pick at signup. `admin` is absent
// deliberately — it is only ever granted directly in the database.
var SelfAssignableRoles = map[Role]bool{
	RoleOrganizer:   true,
	RoleJudge:       true,
	RoleParticipant: true,
}

type User struct {
	ID         string `json:"-"`
	AuthUserID string `json:"-"`
	Name       string `json:"name"`
	Email      string `json:"email"`
	Role       Role   `json:"role"`
}

// Lead is one inbound enquiry. Both kinds share a table and a status workflow
// because they are the same pipeline to whoever works them.
type Lead struct {
	ID     string `json:"id"`
	Kind   string `json:"kind"`
	Email  string `json:"email"`
	TS     string `json:"ts"`
	Status string `json:"status"`

	Picks      []string `json:"picks,omitempty"`
	Audience   string   `json:"audience,omitempty"`
	Dates      string   `json:"dates,omitempty"`
	Attendance string   `json:"attendance,omitempty"`
	Needs      []string `json:"needs,omitempty"`
	Media      []string `json:"media,omitempty"`
	Access     []string `json:"access,omitempty"`

	Company  string   `json:"company,omitempty"`
	Contact  string   `json:"contact,omitempty"`
	Packages []string `json:"packages,omitempty"`
	Goals    []string `json:"goals,omitempty"`
	Budget   string   `json:"budget,omitempty"`
	Message  string   `json:"message,omitempty"`
}

// ConciergeIntake is one chat conversation with the landing page's AI
// concierge, upserted turn by turn. Field values come from the agent
// service's structured extraction, the transcript from the browser's request.
type ConciergeIntake struct {
	ConversationID string
	Lang           string
	Transcript     []byte // JSON array of {role, content}
	EventFormat    string
	Timing         string
	AudienceSize   string
	Goal           string
	ContactName    string
	Email          string
	Complete       bool
}

// Submission carries its scores keyed by judge email, which is what the
// dashboard renders and what averageScore() in the frontend reduces over.
type Submission struct {
	ID      string         `json:"id"`
	Team    string         `json:"team"`
	Project string         `json:"project"`
	Track   string         `json:"track"`
	Desc    string         `json:"desc"`
	Scores  map[string]int `json:"scores"`
	Owner   string         `json:"owner,omitempty"`
}

func isoOrEmpty(t time.Time) string {
	if t.IsZero() {
		return ""
	}
	return t.UTC().Format(time.RFC3339)
}
