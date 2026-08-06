// Command server is the 2% Tech application API.
//
// It owns the data the shared microservices do not model — enquiries and their
// status workflow, hackathon entries, judge scores, and the role attached to
// each account — and fronts the authentication service so the browser never
// holds an API key or a raw token.
package main

import (
	"context"
	"errors"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/ayushozha/2percenttech/api/internal/config"
	"github.com/ayushozha/2percenttech/api/internal/httpapi"
	"github.com/ayushozha/2percenttech/api/internal/jwtvalidator"
	"github.com/ayushozha/2percenttech/api/internal/store"
	"github.com/ayushozha/2percenttech/api/internal/upstream"
)

func main() {
	log.SetFlags(log.LstdFlags | log.LUTC)

	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	st, err := store.New(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer st.Close()

	if err := st.Migrate(ctx); err != nil {
		log.Fatalf("migrate: %v", err)
	}
	log.Print("schema applied")

	// Access tokens are RS256; keys are fetched from the auth service's JWKS
	// and re-fetched when an unknown kid appears. No issuer or audience is
	// enforced because plain login tokens carry neither claim — the binding to
	// this tenant is the client_id claim, which the validator checks.
	validator := jwtvalidator.New(jwtvalidator.Config{
		JWKSURL:         cfg.JWKSURL(),
		ClientID:        cfg.AuthClientID,
		RefreshInterval: 5 * time.Minute,
		ClockSkew:       30 * time.Second,
	})

	srv := httpapi.New(
		cfg,
		st,
		upstream.NewAuthClient(cfg.AuthCallURL(), cfg.AuthAPIKey),
		upstream.NewWaitlistClient(cfg.WaitlistBaseURL, cfg.WaitlistSecretKey),
		validator,
	)

	httpServer := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           srv.Routes(),
		ReadHeaderTimeout: 10 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      30 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	go func() {
		log.Printf("listening on :%s", cfg.Port)
		if err := httpServer.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			log.Fatalf("serve: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop

	log.Print("shutting down")
	shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer shutdownCancel()
	if err := httpServer.Shutdown(shutdownCtx); err != nil {
		log.Printf("shutdown: %v", err)
	}
}
