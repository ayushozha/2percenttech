package httpapi

import (
	"errors"
	"net/http"
	"strings"

	"github.com/ayushozha/2percenttech/api/internal/store"
)

func (s *Server) handleListSubmissions(w http.ResponseWriter, r *http.Request) {
	subs, err := s.store.ListSubmissions(r.Context())
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not load entries")
		return
	}
	writeJSON(w, http.StatusOK, subs)
}

func (s *Server) handleCreateSubmission(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Team    string `json:"team"`
		Project string `json:"project"`
		Desc    string `json:"desc"`
	}
	if !decodeJSON(w, r, &req) {
		return
	}

	req.Team = strings.TrimSpace(req.Team)
	req.Project = strings.TrimSpace(req.Project)
	req.Desc = strings.TrimSpace(req.Desc)

	if req.Team == "" || req.Project == "" || req.Desc == "" {
		writeError(w, http.StatusBadRequest, "incomplete", "fill in every field")
		return
	}

	user := currentUser(r.Context())

	// One entry per person, which the UI already assumes when it decides
	// whether to show the form or the submitted card.
	exists, err := s.store.HasSubmission(r.Context(), user.ID)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not check your entry")
		return
	}
	if exists {
		writeError(w, http.StatusConflict, "already_submitted", "you have already entered a project")
		return
	}

	sub, err := s.store.CreateSubmission(r.Context(), user.ID, req.Team, req.Project, req.Desc)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not save your entry")
		return
	}
	sub.Owner = user.Email
	writeJSON(w, http.StatusCreated, sub)
}

func (s *Server) handleSetScore(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Score int `json:"score"`
	}
	if !decodeJSON(w, r, &req) {
		return
	}
	if req.Score < 1 || req.Score > 10 {
		writeError(w, http.StatusBadRequest, "range", "score must be between 1 and 10")
		return
	}

	judge := currentUser(r.Context())
	err := s.store.SetScore(r.Context(), r.PathValue("id"), judge.ID, req.Score)
	if errors.Is(err, store.ErrNotFound) {
		writeError(w, http.StatusNotFound, "not_found", "no such entry")
		return
	}
	if err != nil {
		writeError(w, http.StatusInternalServerError, "server_error", "could not record the score")
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"submission_id": r.PathValue("id"),
		"judge":         judge.Email,
		"score":         req.Score,
	})
}
