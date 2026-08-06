// Vendored from ayushozha/authentication-service pkg/jwtvalidator.
//
// It is copied rather than imported because that repository's go.mod
// declares module github.com/Ayush10/authentication-service, which does not
// match its GitHub path, so `go get` cannot resolve it. Re-copy these files
// if the upstream validator changes.
package jwtvalidator

import "context"

type contextKey string

const claimsKey contextKey = "jwt_claims"

// WithClaims stores claims in context.
func WithClaims(ctx context.Context, claims *Claims) context.Context {
	return context.WithValue(ctx, claimsKey, claims)
}

// GetClaims retrieves claims from context.
func GetClaims(ctx context.Context) *Claims {
	claims, _ := ctx.Value(claimsKey).(*Claims)
	return claims
}
