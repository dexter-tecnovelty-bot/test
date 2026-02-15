# QA Report (T9)

Date: 2026-02-15  
Branch: `task/t9-qa-uat-release`

## 1. Regression Test Validation

### Commands Run

- `npm run lint` ✅ pass
- `npm run test` ✅ pass
- `npm run build` ✅ pass (`tsc --noEmit && vite build`)

### Results Summary

- Test files: 1
- Total tests: 1
- Passing: 1
- Failing: 0
- TypeScript compile check: pass (via `npm run build`)

### Coverage Summary

- Current repository does not have coverage provider installed for Vitest.
- `npx vitest run --coverage` fails with: missing `@vitest/coverage-v8`.
- Effective measured coverage in this run: unavailable.

### Test Gaps

- No automated tests for auth reducer/actions and validation logic.
- No automated tests for `AuthModal` behavior by mode (`signup`, `login`, `magic_link`).
- No tests for `AuthCallback` route handling (session success/failure).
- No tests for analytics event payloads (`cta_clicked`, `auth_completed`).
- No tests for monitoring integration (`captureAuthFailure` tags, ErrorBoundary capture path).
- No E2E tests for Supabase auth flows.

## 2. Auth Matrix Sign-Off

Status below reflects current local QA environment and static code verification.

| Flow | Implementation Present | Runtime UAT in Current Env | Notes |
| --- | --- | --- | --- |
| Signup (email/password) | Yes | Not executed | `supabase.auth.signUp` with callback redirect configured in `AuthModal`. |
| Login (email/password) | Yes | Not executed | `supabase.auth.signInWithPassword` implemented. |
| Google OAuth (redirect) | Yes | Not executed | `supabase.auth.signInWithOAuth({ provider: 'google' })` with callback URL. |
| Magic link sign-in | Yes | Not executed | `supabase.auth.signInWithOtp` implemented. |
| Password reset flow | No | Not executed | No `resetPasswordForEmail`/recovery UI present. |

Sign-off outcome: partial. Four auth methods are implemented in code; password reset is a functional gap and no live UAT was executed against a configured Supabase project in this environment.

## 3. KPI Instrumentation Check

### Vercel Analytics

- `@vercel/analytics/react` is mounted in `src/main.tsx`.
- CTA event instrumentation present:
  - event: `cta_clicked`
  - source: `src/components/Hero.tsx`
- Signup/login completion instrumentation present:
  - event: `auth_completed`
  - source: `src/components/AuthModal.tsx`

### Sentry Monitoring

- Sentry initialization is implemented in `src/services/monitoring.ts` using `VITE_SENTRY_DSN`.
- ErrorBoundary captures app exceptions via `captureAppError` in `src/components/ErrorBoundary.tsx`.
- Auth failure tagging is implemented via `captureAuthFailure` tags:
  - `area=auth`
  - `provider=<password|google|magic-link>`
  - `mode=<signup|login>`

Instrumentation sign-off: implementation present in code; runtime delivery to external services not validated in this offline QA pass.

## 4. Build Output and Bundle Size

### Dist Structure

- `dist/index.html`
- `dist/assets/index-B09PH-vx.css`
- `dist/assets/index-CIBkcKxs.js`
- `dist/assets/supabase-B3hjqVYg.js`
- `dist/assets/Modal-J0VK64Yi.js`
- `dist/assets/HomePage-Crr6QsGw.js`
- `dist/assets/AuthModal-cdC1_mRu.js`
- `dist/assets/AuthCallback-Vo9icUHt.js`
- `dist/assets/VideoModal-DZdIKvGz.js`
- `dist/assets/tslib.es6-eMSY344_.js`

### Bundle Size Snapshot

- Total `dist/`: ~460 KB (filesystem size)
- Largest chunks (raw / gzip):
  - `dist/assets/index-CIBkcKxs.js`: 184.41 KB / 60.03 KB
  - `dist/assets/supabase-B3hjqVYg.js`: 172.53 KB / 45.47 KB
  - `dist/assets/Modal-J0VK64Yi.js`: 33.16 KB / 11.65 KB
  - `dist/assets/index-B09PH-vx.css`: 18.79 KB / 4.44 KB

## 5. Console Errors/Warnings Review

- Lint: no warnings/errors.
- Build: no warnings/errors.
- Test run: no warnings after T9 cleanup.

## 6. T9 QA Conclusion

- Regression automation status: pass for configured scripts.
- Auth/UAT status: partially complete (code paths present except password reset; live auth UAT pending environment provisioning).
- Observability wiring status: implementation complete in code; runtime signal verification pending deployed environment.
