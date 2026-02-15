# Product Requirements Document: Landing Page

## Executive Summary

Build a production-grade, high-performance landing page using React 18, Tailwind CSS 3, and Supabase Auth. The page is the primary top-of-funnel entry point and must maximize signup conversion, ship with measurable performance budgets, and include deterministic authentication and deployment behavior.

---

## Objectives

1. **Increase conversion rate** from homepage visitors to completed signup by 25% within 60 days of launch.
2. **Achieve page performance targets** on 4G (Lighthouse Performance >=90, FCP <=1.8s, CLS <=0.1, TTI <=2.5s).
3. **Implement reliable authentication** with Supabase email/password, Google OAuth, and magic link, with documented success/failure flows.
4. **Guarantee responsive UX** from 320px to 2560px with no horizontal overflow.
5. **Ship repeatable CI/CD** through Vercel with production-safe headers, previews per PR, and post-deploy verification.

---

## Target Audience

- **Primary:** Early adopters and technical users, age 25-40.
- **Secondary:** Enterprise evaluators and engineering managers.
- **Geographies:** Global launch, optimize first for North America and Europe latency profiles.

---

## Key Features

### 1. Hero Section (Required)

- **Headline:** <=10 words, explicit product value.
- **Subheadline:** <=180 characters, one supporting proof point.
- **Primary CTA:** `Get Started` opens `AuthModal` in signup mode.
- **Secondary CTA:** `Watch Demo` opens in-page video modal.
- **Hero Visual:** Responsive image/video with explicit width/height to avoid layout shift.

### 2. Feature Highlights (Required)

- **Layout:** 3-column grid at >=1024px, 1-column stack below 1024px.
- Each feature card includes:
  - SVG icon (24x24).
  - Title <=5 words.
  - Description 2-3 sentences.
- Initial feature set:
  - **Fast & Scalable**
  - **Secure by Default**
  - **Developer-Friendly**

### 3. Social Proof (Required)

- **Customer logos:** 6 logos minimum, 8 maximum.
- **Testimonials:** 2 quotes minimum with name/title.
- **Stats row:** at least 2 metrics with verifiable sources.

### 4. Pricing Teaser (Required)

- Include Free, Pro, Enterprise columns.
- Show exactly 3 differentiators (API limits, support SLA, team seats).
- `View Full Pricing` link routes to `/pricing`.

### 5. Authentication (Required)

- Modal supports 3 auth modes: `signup`, `login`, `magic_link`.
- Inputs:
  - Email (`type=email`)
  - Password (`type=password`, hidden for magic link mode)
  - Terms checkbox (required only for signup)
- Provider actions:
  - Email/password
  - Google OAuth
  - Magic link

### 6. Footer (Required)

- Navigation links:
  - Product, Pricing, Docs, Blog, About, Careers
  - Support, Terms, Privacy, Status
- Social links: X/Twitter, LinkedIn, GitHub, Discord.
- Newsletter form with validation and success/error states.
- Copyright: `© 2026 [Company Name].`

---

## Technical Stack

| Layer         | Technology               | Decision Rule                                     |
| ------------- | ------------------------ | ------------------------------------------------- |
| Frontend      | React 18 + Vite          | Use function components and hooks only.           |
| Styling       | Tailwind CSS 3.x         | No inline style for layout/spacing tokens.        |
| UI Components | Radix UI (preferred)     | Headless primitives with keyboard support.        |
| Icons         | Lucide React             | Tree-shakeable SVG icons.                         |
| Animation     | Framer Motion            | Limit to entrance transitions under 300ms.        |
| Backend/Auth  | Supabase Auth + Postgres | Use official `@supabase/supabase-js` client only. |
| Deployment    | Vercel                   | Preview per PR, production on `main`.             |
| Analytics     | Vercel Analytics         | Track CTA clicks and signup conversion funnel.    |
| Monitoring    | Sentry                   | Capture frontend exceptions and auth failures.    |

---

## Supabase Auth API Contract (Required)

### SDK Client Setup

```ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Endpoints + SDK Methods

- **Email signup**
  - SDK: `supabase.auth.signUp({ email, password, options: { emailRedirectTo } })`
  - Endpoint: `POST /auth/v1/signup`
- **Email/password login**
  - SDK: `supabase.auth.signInWithPassword({ email, password })`
  - Endpoint: `POST /auth/v1/token?grant_type=password`
- **Google OAuth**
  - SDK: `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })`
  - Endpoint: `GET /auth/v1/authorize?provider=google&redirect_to=<url>`
- **Magic link**
  - SDK: `supabase.auth.signInWithOtp({ email, options: { emailRedirectTo } })`
  - Endpoint: `POST /auth/v1/otp`
- **Fetch active user**
  - SDK: `supabase.auth.getUser()`
  - Endpoint: `GET /auth/v1/user`
- **Logout**
  - SDK: `supabase.auth.signOut()`
  - Endpoint: `POST /auth/v1/logout`

### Auth Flow Details

1. User submits auth form.
2. Client validates fields locally.
3. Client calls one SDK method based on selected provider.
4. On OAuth/magic-link callback route (`/auth/callback`), app executes `supabase.auth.getSession()` and `supabase.auth.getUser()`.
5. If session and user are valid, redirect to `/dashboard`.
6. If session is missing/invalid, redirect to `/login?error=session_invalid`.
7. Modal displays mapped error message and preserves entered email.

### Redirect URLs

- Local: `http://localhost:5173/auth/callback`
- Preview: `https://<project>-<hash>.vercel.app/auth/callback`
- Production: `https://app.example.com/auth/callback`
- All must be registered in Supabase Auth URL allowlist.

---

## User Flows

### 1. New Visitor -> Signup

1. User lands on homepage.
2. User clicks `Get Started`.
3. `AuthModal` opens in `signup` mode.
4. User chooses email/password, Google, or magic link.
5. App executes corresponding Supabase method.
6. If email confirmation is enabled, user confirms via email and returns to `/auth/callback`.
7. App resolves session and routes to `/dashboard`.
8. On failure, app keeps modal open and shows actionable error.

### 2. Returning User -> Login

1. User clicks `Log In`.
2. `AuthModal` opens in `login` mode.
3. User submits credentials or requests magic link.
4. Successful login redirects to `/dashboard`.
5. Failed login keeps form data and displays field/form errors.

### 3. Mobile User -> Browse + Convert

1. User browses hero, features, social proof.
2. User taps `Watch Demo` or `Get Started`.
3. Modal and form controls are fully keyboard- and touch-accessible.
4. Auth completion follows same callback and redirect contract.

---

## React Component Contracts (Required)

### Shared Types

```ts
export type AuthMode = 'login' | 'signup' | 'magic_link';
export type AuthProvider = 'password' | 'google' | 'magic_link';
```

### `Hero` Props

```ts
interface HeroProps {
  headline: string;
  subheadline: string;
  primaryCtaLabel: 'Get Started';
  secondaryCtaLabel: 'Watch Demo';
  onPrimaryCtaClick: () => void;
  onSecondaryCtaClick: () => void;
}
```

### `FeatureGrid` Props

```ts
interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface FeatureGridProps {
  items: [FeatureItem, FeatureItem, FeatureItem];
}
```

### `AuthModal` Props + State

```ts
interface AuthModalProps {
  isOpen: boolean;
  initialMode: AuthMode;
  onClose: () => void;
  onAuthSuccess: (userId: string) => void;
}

interface AuthFormState {
  mode: AuthMode;
  email: string;
  password: string;
  acceptTerms: boolean;
  isSubmitting: boolean;
  fieldErrors: Partial<Record<'email' | 'password' | 'acceptTerms', string>>;
  formError: string | null;
}
```

### State Pattern (Required)

- Use `useReducer` for `AuthFormState`.
- Required reducer actions: `FIELD_UPDATED`, `MODE_CHANGED`, `SUBMIT_STARTED`, `VALIDATION_FAILED`, `SUBMIT_SUCCEEDED`, `SUBMIT_FAILED`.
- Disable submit controls while `isSubmitting` is `true`.
- Preserve `email` on failed submission.

---

## Error Handling Standards (Required)

### Validation

- Validate before API call:
  - Email format valid.
  - Password length >=8 for password flows.
  - Terms checkbox true for signup.
- Render field-level errors directly below each input.

### Auth Error Mapping

Implement `mapAuthError(codeOrMessage: string): string` with exact outputs:

- Invalid credentials -> `Email or password is incorrect.`
- Email not confirmed -> `Confirm your email before logging in.`
- Rate-limited -> `Too many attempts. Try again in a few minutes.`
- Network failure -> `Network error. Check your connection and retry.`
- Default -> `Authentication failed. Please try again.`

### Runtime Failures

- Wrap each async submit in `try/catch`.
- Add app-level React `ErrorBoundary` around routed pages.
- Fallback UI must include:
  - generic error message,
  - reload button,
  - support link.

### Logging

- Send auth failures to Sentry with tags:
  - `area=auth`
  - `provider=password|google|magic_link`
  - `mode=login|signup|magic_link`
- Do not log passwords, auth tokens, or raw JWT payloads.

---

## Design Guidelines

### Brand Colors

- **Primary:** `#3B82F6`
- **Secondary:** `#10B981`
- **Accent:** `#F59E0B`
- **Neutral:** `#64748B`
- **Background:** `#FFFFFF`

### Typography

- **Headings:** Inter 700 (H1 48/60, H2 36/44, H3 24/32)
- **Body:** Inter 400 (16/24)
- **CTA:** Inter 600 (16)

### Spacing

- Desktop section spacing: `64px`
- Mobile section spacing: `48px`
- Use Tailwind scale tokens only.

### Accessibility

- WCAG 2.1 AA contrast minimum.
- Full keyboard navigation for modal and nav.
- Visible focus styles for all interactive controls.
- `aria-label` required for icon-only buttons.

---

## Performance Requirements

- Lighthouse categories (Perf, Accessibility, Best Practices, SEO) >=90 on production URL.
- Time to Interactive <=2.5s on simulated 4G.
- Cumulative Layout Shift <=0.1.
- First Contentful Paint <=1.8s.
- Serve AVIF/WebP images with explicit dimensions.
- Lazy-load below-the-fold media.
- Code split auth modal and video modal using dynamic imports.

---

## Security & Compliance

- Use Supabase Auth only; no custom password handling in application code.
- Enforce least-privilege RLS policies for user data.
- Serve all traffic over HTTPS only.
- Set CSP and security headers in `vercel.json`.
- Show cookie consent when analytics is enabled for regulated regions.
- Run dependency audit (`npm audit --omit=dev`) before production release.

---

## Deployment Pipeline

1. **Local Development**
   - Install: `npm ci`
   - Run: `npm run dev`
   - Local URL: `http://localhost:5173`
2. **Version Control**
   - Feature branch -> pull request -> review -> merge to `main`.
3. **Vercel Project Configuration (Required)**
   - Framework preset: `Vite`
   - Install command: `npm ci`
   - Build command: `npm run build`
   - Output directory: `dist`
   - Node.js: `20.x`
4. **Environment Variables (Required in Preview + Production)**
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_ENV` (`preview` or `production`)
5. **`vercel.json` Example (Required Baseline)**

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://vercel.live; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        }
      ]
    }
  ],
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

6. **CI Quality Gate (Example)**

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]
jobs:
  test-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run test -- --run
      - run: npm run build
```

7. **Post-Deploy Checklist (Required)**
   - Run Lighthouse on production URL and record report.
   - Verify auth flows: password, Google OAuth, magic link, logout.
   - Check Vercel logs and Sentry for first 30 minutes.
   - Confirm conversion tracking events fire for CTA and signup completion.

---

## Timeline & Milestones

| Phase                          | Duration | Owner             | Deliverable                                     |
| ------------------------------ | -------- | ----------------- | ----------------------------------------------- |
| Design Mockups                 | 3 days   | Design            | Desktop + mobile designs                        |
| Scaffolding                    | 1 day    | Frontend          | Vite + Tailwind + routing                       |
| Component Library              | 3 days   | Frontend          | Reusable UI primitives                          |
| Hero + Features + Social Proof | 2 days   | Frontend          | Complete above-the-fold and trust content       |
| Auth Integration               | 3 days   | Frontend          | Supabase auth flows + callback route            |
| QA + Bug Fixes                 | 2 days   | QA + Frontend     | Cross-browser + mobile pass                     |
| Deployment + Hardening         | 2 days   | DevOps + Frontend | Vercel production deploy + headers + monitoring |

**Total:** 16 working days.

---

## Success Metrics (KPIs)

- Signup conversion >=5% in first 30 days.
- Bounce rate <=40% desktop, <=50% mobile.
- Average session duration >=2 minutes.
- Mobile traffic share >=50%.
- Lighthouse >=90 in all categories.
- Uptime >=99.9% via Vercel status metrics.

---

## Open Questions & Risks

1. **Question:** Include live chat in MVP?
   **Decision:** No. Defer to post-launch iteration.
2. **Question:** Add dark mode in MVP?
   **Decision:** No. Reassess after launch analytics.
3. **Risk:** Auth provider outage or throttling.
   **Mitigation:** Provide clear fallback to magic link and monitor error rate alerts.

---

## Appendix

### A. Example Component Structure

```text
src/
├── components/
│   ├── Hero.tsx
│   ├── FeatureGrid.tsx
│   ├── SocialProof.tsx
│   ├── PricingTeaser.tsx
│   ├── AuthModal.tsx
│   └── Footer.tsx
├── routes/
│   └── AuthCallback.tsx
├── lib/
│   └── supabase.ts
├── utils/
│   └── mapAuthError.ts
├── App.tsx
├── main.tsx
└── index.css
```

### B. Sample `.env` File

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_APP_ENV=preview
```

### C. Useful Links

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Auth REST API](https://supabase.com/docs/guides/auth/auth-api)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [React Docs](https://react.dev/learn)

---

**Approved by:** [Your Name]
**Date:** 2026-02-15
**Version:** 3.0 (Production-Ready)
