import * as Sentry from '@sentry/react';

type AuthFailureProvider = 'password' | 'google' | 'magic-link';
type AuthFailureMode = 'signup' | 'login';

interface AuthFailureTags {
  provider: AuthFailureProvider;
  mode: AuthFailureMode;
}

const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

export const initializeMonitoring = () => {
  if (!sentryDsn) {
    return;
  }

  Sentry.init({
    dsn: sentryDsn,
    environment: import.meta.env.MODE,
  });
};

export const captureAppError = (error: unknown) => {
  if (error instanceof Error) {
    Sentry.captureException(error);
    return;
  }

  Sentry.captureException(new Error(String(error)));
};

export const captureAuthFailure = (error: unknown, { provider, mode }: AuthFailureTags) => {
  Sentry.withScope((scope) => {
    scope.setTag('area', 'auth');
    scope.setTag('provider', provider);
    scope.setTag('mode', mode);
    captureAppError(error);
  });
};
