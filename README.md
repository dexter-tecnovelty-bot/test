# Landing App

Production-ready bootstrap for Vite 5 + React 18 + TypeScript with Tailwind, Router, ESLint/Prettier, and Vitest.

## Environment Variables

The app expects these client-side variables (prefix `VITE_`):

| Variable | Required | Purpose | Example |
| --- | --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL used by auth client. | `https://your-project.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase public anon key for browser auth calls. | `eyJ...` |
| `VITE_SENTRY_DSN` | Recommended | DSN for client error reporting (`@sentry/react`). Leave empty to disable Sentry init. | `https://abc123@o0.ingest.sentry.io/0` |

## Preview vs Production Matrix

| Environment | `VITE_SUPABASE_URL` | `VITE_SUPABASE_ANON_KEY` | `VITE_SENTRY_DSN` |
| --- | --- | --- | --- |
| Preview (Vercel) | Required | Required | Optional (recommended) |
| Production (Vercel) | Required | Required | Optional (recommended) |
| GitHub Actions CI | Required for strict parity | Required for strict parity | Optional |

### Setup Notes

- Configure the variables in Vercel for both **Preview** and **Production** environments.
- Configure matching repository secrets for GitHub Actions CI (`Settings -> Secrets and variables -> Actions`).
- In Supabase Auth redirect settings, allow local, preview, and production callback URLs ending in `/auth/callback`.
