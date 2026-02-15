# Landing App

React 18 + Vite + Tailwind + Supabase landing page with auth modal flows, analytics events, and Sentry integration.

## Tech Stack

- React 18 + TypeScript + Vite 5
- Tailwind CSS 3
- Supabase Auth (`@supabase/supabase-js`)
- Vercel Analytics (`@vercel/analytics`)
- Sentry (`@sentry/react`)
- Vitest + Testing Library
- ESLint + Prettier

## Setup

1. Install dependencies:
   - `npm ci`
2. Configure environment:
   - Copy `.env.example` to `.env`
   - Set required values
3. Start local app:
   - `npm run dev`

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `VITE_SENTRY_DSN` | No (recommended) | Sentry DSN for client error reporting |

## Supabase Auth Configuration

In Supabase Dashboard -> Authentication -> URL Configuration:

- Set Site URL to your production frontend URL.
- Add redirect URLs:
  - `http://localhost:5173/auth/callback`
  - `https://<preview-deployment>.vercel.app/auth/callback`
  - `https://<production-domain>/auth/callback`
- Enable providers needed by this app:
  - Email/password
  - Magic link
  - Google OAuth

## Scripts

- `npm run dev` - start dev server
- `npm run lint` - lint TypeScript/React files
- `npm run test` - run test suite
- `npm run build` - type-check and production build
- `npm run preview` - preview production build locally

## Auth Flows

Implemented in code:

- Signup with email/password
- Login with email/password
- Google OAuth redirect
- Magic link sign-in

Not implemented:

- Password reset flow

## Monitoring and Observability

### Vercel Analytics

- Component mounted in `src/main.tsx`.
- Event `cta_clicked` emitted from hero CTA interactions.
- Event `auth_completed` emitted on successful auth completions.

### Sentry

- Initialized from `src/services/monitoring.ts` when `VITE_SENTRY_DSN` is present.
- Error boundary reports unhandled UI exceptions.
- Auth failures are tagged with:
  - `area=auth`
  - `provider=password|google|magic-link`
  - `mode=signup|login`

## QA and Release Docs

- `QA_REPORT.md` - QA execution results and test gaps
- `RELEASE_CHECKLIST.md` - pre/post-deploy release checklist
- `DEPLOYMENT.md` - environment and deployment procedure

## Known Limitations / TODO

- Password reset flow is pending implementation.
- Coverage reporting is not configured (`@vitest/coverage-v8` not installed).
- Runtime auth/UAT requires configured Supabase credentials and provider setup.
