# Deployment Guide

## Deployment Summary (T9)

- Build pipeline validated locally (`lint`, `test`, `build`).
- Vercel config is present in `vercel.json` (SPA rewrites + security headers).
- Auth callback route is `/auth/callback` and must be allowlisted in Supabase.
- Observability hooks are implemented for Vercel Analytics and Sentry.

## Prerequisites

- Node.js 20+ (Node.js 22 recommended)
- npm
- Vercel project connected to repository
- Supabase project with Auth providers configured

## Environment Setup

Set these in Vercel for **Preview** and **Production**:

- `VITE_SUPABASE_URL` (required)
- `VITE_SUPABASE_ANON_KEY` (required)
- `VITE_SENTRY_DSN` (optional, recommended)

Local setup:

1. Copy `.env.example` to `.env`.
2. Fill required values.
3. Run:
   - `npm ci`
   - `npm run dev`

## Supabase Redirect Allowlist

Configure in Supabase Dashboard -> Authentication -> URL Configuration:

- `http://localhost:5173/auth/callback`
- `https://<preview-deployment>.vercel.app/auth/callback`
- `https://<production-domain>/auth/callback`

Also ensure:

- Site URL is the production URL.
- Google provider is configured for OAuth flow.
- Email auth is enabled for password and magic-link flows.

## Build and Verify

Run before deploy:

- `npm run lint`
- `npm run test`
- `npm run build`

Expected build output is generated to `dist/`.

## Deploy to Vercel

1. Push release branch and open PR.
2. Confirm preview deployment health.
3. Merge to main.
4. Promote/verify production deployment.

## Post-Deploy Validation

1. Auth flow smoke tests:
   - Signup (email/password)
   - Login (email/password)
   - Google OAuth
   - Magic link
   - Password reset (if implemented)
2. Confirm analytics events:
   - `cta_clicked`
   - `auth_completed`
3. Confirm Sentry captures:
   - Error boundary exceptions
   - Auth failure tags (`area`, `provider`, `mode`)

## Known Current Gaps

- Password reset flow is not implemented in current codebase.
- Automated coverage reporting is not enabled (`@vitest/coverage-v8` missing).
- Auth flows require live Supabase credentials for full UAT.
