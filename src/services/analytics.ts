import { track } from '@vercel/analytics';

type AuthCompletionProvider = 'password' | 'magic-link' | 'google';
type AuthCompletionMode = 'signup' | 'login';
type CtaTarget = 'primary' | 'secondary';

interface TrackCtaClickOptions {
  location: string;
  target: CtaTarget;
}

interface TrackAuthCompletionOptions {
  provider: AuthCompletionProvider;
  mode: AuthCompletionMode;
}

export const trackCtaClick = ({ location, target }: TrackCtaClickOptions) => {
  track('cta_clicked', {
    location,
    target,
  });
};

export const trackAuthCompletion = ({ provider, mode }: TrackAuthCompletionOptions) => {
  track('auth_completed', {
    provider,
    mode,
  });
};
