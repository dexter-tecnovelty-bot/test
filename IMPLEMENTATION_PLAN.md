# Implementation Plan: React + Tailwind + Supabase Landing Page

## 1) Task Breakdown With Dependencies

### Dependency Graph (High Level)

```text
T1 Project Bootstrap
  -> T2 Design Tokens + Base Layout
  -> T3 Core UI Primitives
  -> T4 Landing Sections
  -> T5 Auth System
  -> T6 Analytics + Monitoring
  -> T7 Performance + Accessibility Hardening
  -> T8 CI/CD + Security Headers
  -> T9 QA, UAT, Release
```

### Detailed Task List

| ID | Task | Deliverables | Depends On | Est. Effort |
|---|---|---|---|---|
| T1 | Initialize project + tooling | Vite React 18 app, Tailwind 3, routing, lint/test setup, env template | None | 0.5 day |
| T2 | Foundation styles + design tokens | Brand colors, typography scale, spacing system, responsive container, global focus styles | T1 | 0.5 day |
| T3 | Shared UI primitives | Button, Input, Checkbox, Modal wrapper (Radix), section shell, icon wrapper | T2 | 1.0 day |
| T4 | Landing page sections | Hero, FeatureGrid, SocialProof, PricingTeaser, Footer, VideoModal, responsive behavior | T3 | 2.0 days |
| T5 | Authentication implementation | Supabase client, AuthModal reducer/state/actions, form validation, auth methods, callback route, redirect logic | T3 | 2.5 days |
| T6 | Observability + funnel tracking | Vercel Analytics events, Sentry setup, auth failure tagging, error boundary fallback | T5 | 1.0 day |
| T7 | Performance + accessibility hardening | Dynamic imports for modals, image optimization, Lighthouse tuning, keyboard/focus audit, CLS checks | T4, T5, T6 | 1.5 days |
| T8 | CI/CD + deployment hardening | `vercel.json`, GitHub Actions CI, env var matrix, preview validation workflow | T7 | 1.0 day |
| T9 | End-to-end validation + launch | Regression test pass, auth matrix sign-off, KPI instrumentation check, production release checklist | T8 | 1.0 day |

Total estimate: **11.0 working days** (single developer). Add 15% buffer for external dependencies (OAuth config, copy/assets approvals).

---

## 2) Component Architecture Diagram

### Mermaid

```mermaid
flowchart TD
  A[main.tsx] --> B[App.tsx]
  B --> C[LandingPage]
  C --> D[Hero]
  C --> E[FeatureGrid]
  C --> F[SocialProof]
  C --> G[PricingTeaser]
  C --> H[Footer]
  C --> I[AuthModal lazy]
  C --> J[VideoModal lazy]

  B --> K[/auth/callback Route]
  K --> L[AuthCallback]
  L --> M[supabase.auth.getSession]
  L --> N[supabase.auth.getUser]
  M --> O{Valid session?}
  N --> O
  O -->|Yes| P[/dashboard]
  O -->|No| Q[/login?error=session_invalid]

  I --> R[useReducer AuthFormState]
  R --> S[validateAuthForm]
  S --> T[mapAuthError]
  R --> U[supabase.auth.signUp]
  R --> V[supabase.auth.signInWithPassword]
  R --> W[supabase.auth.signInWithOAuth]
  R --> X[supabase.auth.signInWithOtp]

  B --> Y[ErrorBoundary]
  R --> Z[Sentry captureException]
  C --> AA[Vercel Analytics Track]
```

### ASCII

```text
main.tsx
└── App.tsx
    ├── ErrorBoundary
    ├── Routes
    │   ├── /                -> LandingPage
    │   │   ├── Hero
    │   │   ├── FeatureGrid
    │   │   ├── SocialProof
    │   │   ├── PricingTeaser
    │   │   ├── Footer
    │   │   ├── AuthModal (lazy)
    │   │   └── VideoModal (lazy)
    │   └── /auth/callback   -> AuthCallback
    │       └── supabase.auth.getSession/getUser -> redirect
    ├── lib/supabase.ts
    ├── utils/mapAuthError.ts
    ├── utils/validation.ts
    ├── services/analytics.ts
    └── services/monitoring.ts (Sentry)
```

---

## 3) File Structure (All Files Needed)

```text
.
├── .env.example
├── .eslintrc.cjs
├── .github/
│   └── workflows/
│       └── ci.yml
├── index.html
├── package.json
├── postcss.config.cjs
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json
├── vite.config.ts
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── assets/
    │   ├── hero.avif
    │   ├── hero.webp
    │   ├── logos/
    │   │   ├── logo-1.svg
    │   │   ├── logo-2.svg
    │   │   ├── logo-3.svg
    │   │   ├── logo-4.svg
    │   │   ├── logo-5.svg
    │   │   └── logo-6.svg
    │   └── demo-poster.webp
    ├── types/
    │   └── auth.ts
    ├── lib/
    │   └── supabase.ts
    ├── utils/
    │   ├── mapAuthError.ts
    │   ├── validation.ts
    │   └── constants.ts
    ├── services/
    │   ├── analytics.ts
    │   └── monitoring.ts
    ├── hooks/
    │   └── useAuthFormReducer.ts
    ├── components/
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Checkbox.tsx
    │   │   ├── Modal.tsx
    │   │   └── Section.tsx
    │   ├── Hero.tsx
    │   ├── FeatureGrid.tsx
    │   ├── SocialProof.tsx
    │   ├── PricingTeaser.tsx
    │   ├── Footer.tsx
    │   ├── AuthModal.tsx
    │   ├── VideoModal.tsx
    │   └── ErrorBoundary.tsx
    ├── pages/
    │   ├── LandingPage.tsx
    │   └── AuthCallback.tsx
    └── tests/
        ├── unit/
        │   ├── mapAuthError.test.ts
        │   ├── validation.test.ts
        │   └── authReducer.test.ts
        ├── component/
        │   ├── Hero.test.tsx
        │   ├── FeatureGrid.test.tsx
        │   ├── AuthModal.test.tsx
        │   └── Footer.test.tsx
        └── e2e/
            ├── signup-flow.spec.ts
            ├── login-flow.spec.ts
            ├── magic-link-flow.spec.ts
            └── responsive-layout.spec.ts
```

Notes:
- `AuthModal` and `VideoModal` should be dynamically imported from `LandingPage`.
- Keep callback/auth routing in `pages/AuthCallback.tsx` to isolate redirect behavior.

---

## 4) Step-by-Step Development Sequence

1. Bootstrap project (`T1`)
- Run: `npm create vite@latest . -- --template react-ts`
- Install core deps: `react-router-dom`, `@supabase/supabase-js`, `@radix-ui/react-dialog`, `lucide-react`, `framer-motion`, `@vercel/analytics`, `@sentry/react`.
- Install dev deps: `tailwindcss`, `postcss`, `autoprefixer`, `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `playwright`, `eslint`.

2. Implement design system foundation (`T2`)
- Add Tailwind config with PRD colors and spacing rules.
- Add typography + focus ring styles in `src/index.css`.
- Create shared container/section layout utility.

3. Build reusable UI primitives (`T3`)
- Implement `Button`, `Input`, `Checkbox`, `Modal`, `Section`.
- Ensure keyboard interactions and visible focus states.
- Write component smoke tests.

4. Build landing sections (`T4`)
- Implement Hero with CTA handlers and fixed media dimensions.
- Implement FeatureGrid (3-up desktop, stack mobile).
- Implement SocialProof (6 logos min, 2 testimonials min, stats row).
- Implement PricingTeaser (exactly 3 differentiators; link `/pricing`).
- Implement Footer links/social/newsletter with validation states.

5. Implement auth domain (`T5`)
- Add `src/types/auth.ts` for `AuthMode` and `AuthProvider`.
- Add `src/lib/supabase.ts` using env vars contract.
- Implement `useReducer` auth state/actions exactly as PRD requires.
- Implement local validation rules and field-level errors.
- Implement provider actions: password, Google OAuth, magic link.
- Preserve entered email on failures and map backend errors with exact text.
- Implement `/auth/callback` flow: `getSession` + `getUser` -> redirect logic.

6. Add error boundaries, analytics, monitoring (`T6`)
- Wrap routes with `ErrorBoundary` fallback UI.
- Wire Vercel analytics for CTA click + signup completion funnel.
- Wire Sentry and auth failure tagging (`area`, `provider`, `mode`).

7. Performance + accessibility hardening (`T7`)
- Lazy-load `AuthModal` and `VideoModal` with `React.lazy`.
- Use AVIF/WebP hero assets and explicit dimensions.
- Defer/lazy-load below-the-fold media.
- Run Lighthouse + fix regressions to reach PRD budgets.
- Validate keyboard-only navigation and WCAG AA contrast.

8. Deployment configuration (`T8`)
- Add `vercel.json` headers and SPA rewrite.
- Add GitHub Actions CI: lint, test, build.
- Configure preview + production env vars.
- Confirm Supabase redirect allowlist includes local/preview/prod callback URLs.

9. Release validation (`T9`)
- Run full test matrix and manual auth sanity tests.
- Check Vercel logs + Sentry events post-deploy.
- Capture Lighthouse report and KPI tracking evidence.
- Promote to production and monitor first 30 minutes.

---

## 5) Testing Strategy Per Component

| Component/Area | Unit Tests | Component/Integration Tests | E2E Tests | Acceptance Criteria |
|---|---|---|---|---|
| `Hero` | CTA handler invocation | Renders required headline/subheadline length constraints and CTA labels | Home render on desktop/mobile | Primary CTA opens auth modal; no layout shift from hero media |
| `FeatureGrid` | Item schema validation utility (optional) | Exactly 3 cards, icons render, responsive class behavior | Mobile-to-desktop viewport checks | 1-column <1024px, 3-column >=1024px |
| `SocialProof` | Stats formatter/source helper | 6-8 logos render, testimonials show name/title | Landing smoke | Required trust content visible and responsive |
| `PricingTeaser` | Differentiator data shape | Exactly 3 differentiators and `/pricing` link | Navigation check | Free/Pro/Enterprise columns present |
| `AuthModal` + reducer | Reducer action transitions, validation, `mapAuthError` exact outputs | Mode switching, terms checkbox enforcement, loading state disables submit, email persistence on failure | Signup/login/magic-link flows | Correct SDK call per mode/provider; error strings match PRD |
| `AuthCallback` | Session resolution helper | Redirect behavior for valid vs invalid sessions | OAuth/magic link callback paths | Valid -> `/dashboard`; invalid -> `/login?error=session_invalid` |
| `Footer` + newsletter | Email validator | Success and error states; required links/socials | Footer interaction smoke | All required links render; newsletter states work |
| `ErrorBoundary` | Fallback rendering | Reload button and support link behavior | Injected runtime error scenario | App fails safely with recoverable UI |
| Analytics + Sentry | Event payload unit checks | Hook fires on CTA and signup success | Post-deploy event verification | Events visible in Vercel Analytics; auth failures in Sentry without secrets |
| Global performance/a11y | N/A | Lighthouse CI optional | Production URL audit | Lighthouse categories >=90, FCP/TTI/CLS targets met |

Recommended commands:
- Unit/component: `npm run test -- --run`
- E2E: `npx playwright test`
- Lighthouse: `npx lighthouse https://<deployment-url> --view`
- Security audit: `npm audit --omit=dev`

---

## 6) Deployment Checklist

### Pre-Deploy
- [ ] `npm ci` succeeds on Node 20.x.
- [ ] `npm run lint`, `npm run test -- --run`, `npm run build` all pass.
- [ ] `.env` values set for preview/production:
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_APP_ENV`
- [ ] Supabase allowlist contains:
  - [ ] `http://localhost:5173/auth/callback`
  - [ ] `https://<project>-<hash>.vercel.app/auth/callback`
  - [ ] `https://app.example.com/auth/callback`
- [ ] `vercel.json` headers include CSP + security headers.

### Deploy
- [ ] Merge reviewed PR into `main`.
- [ ] Verify Vercel production deployment succeeds.
- [ ] Confirm SPA rewrite works for direct route loads (`/auth/callback`).

### Post-Deploy (First 30 Minutes)
- [ ] Run Lighthouse on production URL; archive report.
- [ ] Execute manual auth matrix: signup, login, Google OAuth, magic link, logout.
- [ ] Validate CTA and signup conversion events in Vercel Analytics.
- [ ] Check Sentry for auth/runtime errors and confirm tags.
- [ ] Verify no horizontal overflow at 320px and key desktop widths.

### Release Sign-Off
- [ ] KPI instrumentation verified.
- [ ] Incident rollback owner identified.
- [ ] Release note recorded with deployment URL and commit SHA.

---

## 7) Time Estimates Per Task (Actionable Scheduling)

| Task ID | Estimate | Suggested Calendar Slot | Output Gate |
|---|---|---|---|
| T1 | 0.5 day | Day 1 AM | App boots, lint/test/build run |
| T2 | 0.5 day | Day 1 PM | Tokens/styles match PRD |
| T3 | 1.0 day | Day 2 | Reusable primitives complete |
| T4 | 2.0 days | Days 3-4 | Landing sections feature-complete |
| T5 | 2.5 days | Days 5-7 (half day) | Auth flows + callback complete |
| T6 | 1.0 day | Day 7 (half day)-Day 8 AM | Analytics/Sentry wired |
| T7 | 1.5 days | Day 8 PM-Day 10 AM | Perf + a11y targets met |
| T8 | 1.0 day | Day 10 PM-Day 11 AM | CI/CD + headers hardened |
| T9 | 1.0 day | Day 11 PM-Day 12 | QA pass + production launch |

Critical path: **T1 -> T2 -> T3 -> T4 -> T5 -> T6 -> T7 -> T8 -> T9**.

Risk buffer: **1.5-2.0 days** reserved for OAuth configuration delays, copy/legal approvals, or performance tuning.

---

## Definition of Done

- All required PRD sections implemented and visible.
- Auth contracts and callback redirects behave exactly as specified.
- Error mapping strings match PRD verbatim.
- Lighthouse metrics and accessibility requirements achieved on production URL.
- CI gates enforced and deployment checklist fully completed.
