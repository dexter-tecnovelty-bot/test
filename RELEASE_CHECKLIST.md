# Production Release Checklist

Date prepared: 2026-02-15

## Pre-Deploy Checks

- [ ] Branch is up to date and approved for release.
- [ ] `npm ci` completes successfully.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] QA report reviewed: `QA_REPORT.md`.
- [ ] Known limitations accepted by stakeholders.

## Environment Variables

Required in Vercel (Preview + Production):

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_SENTRY_DSN` (optional but strongly recommended)

Recommended parity in CI secrets:

- [ ] `VITE_SUPABASE_URL`
- [ ] `VITE_SUPABASE_ANON_KEY`
- [ ] `VITE_SENTRY_DSN`

## Supabase Auth Configuration

In Supabase Dashboard -> Authentication -> URL Configuration:

- [ ] Site URL set to production frontend URL.
- [ ] Redirect allowlist includes:
  - [ ] `http://localhost:5173/auth/callback`
  - [ ] `https://<preview-deployment>.vercel.app/auth/callback`
  - [ ] `https://<production-domain>/auth/callback`
- [ ] Google provider enabled and credentials configured.
- [ ] Email provider enabled for password + magic link flows.

## Vercel Deployment Checks

- [ ] `vercel.json` applied (SPA rewrites + security headers).
- [ ] Preview deployment succeeds.
- [ ] Production promotion succeeds.
- [ ] `/auth/callback` route resolves correctly in production.

## Monitoring and KPI Checks (Post-Deploy)

- [ ] Vercel Analytics receives `cta_clicked` events.
- [ ] Vercel Analytics receives `auth_completed` events.
- [ ] Sentry receives a test exception from ErrorBoundary path.
- [ ] Auth failures in Sentry include tags: `area`, `provider`, `mode`.

## UAT Sign-Off

- [ ] Signup with email/password
- [ ] Login with email/password
- [ ] Google OAuth redirect flow
- [ ] Magic link sign-in flow
- [ ] Password reset flow (if implemented)

## Launch Window Monitoring (First 30 Minutes)

- [ ] No spike in Sentry errors.
- [ ] Auth callback success rate appears normal.
- [ ] CTA and auth completion events are visible in analytics.
- [ ] Rollback plan validated and available.
