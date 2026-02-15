import { useEffect, useMemo, useReducer, useState } from 'react';
import type { FormEvent } from 'react';
import Button from './ui/Button';
import Checkbox from './ui/Checkbox';
import Input from './ui/Input';
import Modal from './ui/Modal';
import supabase from '../lib/supabase';

type AuthMode = 'signup' | 'login' | 'magic_link';
type AuthField = 'email' | 'password' | 'acceptTerms';
type AuthFieldErrors = Partial<Record<AuthField, string>>;

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
  fieldErrors: AuthFieldErrors;
  formError: string | null;
}

type AuthAction =
  | { type: 'FIELD_UPDATED'; payload: { field: AuthField; value: string | boolean } }
  | { type: 'MODE_CHANGED'; payload: { mode: AuthMode } }
  | { type: 'SUBMIT_STARTED' }
  | { type: 'VALIDATION_FAILED'; payload: { fieldErrors: AuthFieldErrors } }
  | { type: 'SUBMIT_SUCCEEDED' }
  | { type: 'SUBMIT_FAILED'; payload: { error: string } };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const getCallbackUrl = () => `${window.location.origin}/auth/callback`;

const mapAuthError = (codeOrMessage: string): string => {
  const value = codeOrMessage.toLowerCase();

  if (value.includes('invalid login credentials') || value.includes('invalid credentials')) {
    return 'Email or password is incorrect.';
  }

  if (value.includes('email not confirmed')) {
    return 'Confirm your email before logging in.';
  }

  if (
    value.includes('rate limit') ||
    value.includes('too many requests') ||
    value.includes('too many attempts')
  ) {
    return 'Too many attempts. Try again in a few minutes.';
  }

  if (
    value.includes('network error') ||
    value.includes('failed to fetch') ||
    value.includes('network request failed')
  ) {
    return 'Network error. Check your connection and retry.';
  }

  return 'Authentication failed. Please try again.';
};

const validateAuthForm = (state: AuthFormState): AuthFieldErrors => {
  const errors: AuthFieldErrors = {};

  if (!EMAIL_PATTERN.test(state.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (state.mode !== 'magic_link' && state.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (state.mode === 'signup' && !state.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms to continue.';
  }

  return errors;
};

const getInitialState = (mode: AuthMode): AuthFormState => ({
  mode,
  email: '',
  password: '',
  acceptTerms: false,
  isSubmitting: false,
  fieldErrors: {},
  formError: null,
});

const authReducer = (state: AuthFormState, action: AuthAction): AuthFormState => {
  switch (action.type) {
    case 'FIELD_UPDATED': {
      const { field, value } = action.payload;
      return {
        ...state,
        [field]: value,
        fieldErrors: {
          ...state.fieldErrors,
          [field]: undefined,
        },
        formError: null,
      };
    }
    case 'MODE_CHANGED':
      return {
        ...state,
        mode: action.payload.mode,
        password: '',
        acceptTerms: false,
        isSubmitting: false,
        fieldErrors: {},
        formError: null,
      };
    case 'SUBMIT_STARTED':
      return {
        ...state,
        isSubmitting: true,
        formError: null,
      };
    case 'VALIDATION_FAILED':
      return {
        ...state,
        isSubmitting: false,
        fieldErrors: action.payload.fieldErrors,
      };
    case 'SUBMIT_SUCCEEDED':
      return {
        ...state,
        isSubmitting: false,
        fieldErrors: {},
        formError: null,
      };
    case 'SUBMIT_FAILED':
      return {
        ...state,
        isSubmitting: false,
        formError: action.payload.error,
      };
    default:
      return state;
  }
};

const getTitle = (mode: AuthMode): string => {
  if (mode === 'signup') return 'Create your account';
  if (mode === 'magic_link') return 'Continue with magic link';
  return 'Log in';
};

const getModeLabel = (mode: AuthMode): string => {
  if (mode === 'magic_link') return 'Magic Link';
  if (mode === 'signup') return 'Sign Up';
  return 'Log In';
};

const getSubmitLabel = (mode: AuthMode): string => {
  if (mode === 'signup') return 'Create Account';
  if (mode === 'magic_link') return 'Send Magic Link';
  return 'Log In';
};

const AuthModal = ({ isOpen, initialMode, onClose, onAuthSuccess }: AuthModalProps) => {
  const [state, dispatch] = useReducer(authReducer, initialMode, getInitialState);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { mode, email, password, acceptTerms, isSubmitting, fieldErrors, formError } = state;
  const callbackUrl = useMemo(() => getCallbackUrl(), []);

  useEffect(() => {
    dispatch({ type: 'MODE_CHANGED', payload: { mode: initialMode } });
    setSuccessMessage(null);
  }, [initialMode, isOpen]);

  const switchMode = (nextMode: AuthMode) => {
    setSuccessMessage(null);
    dispatch({ type: 'MODE_CHANGED', payload: { mode: nextMode } });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMessage(null);
    dispatch({ type: 'SUBMIT_STARTED' });

    const validationErrors = validateAuthForm(state);
    if (Object.keys(validationErrors).length > 0) {
      dispatch({ type: 'VALIDATION_FAILED', payload: { fieldErrors: validationErrors } });
      return;
    }

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: callbackUrl,
          },
        });

        if (error) throw error;

        dispatch({ type: 'SUBMIT_SUCCEEDED' });

        if (data.user?.id) {
          onAuthSuccess(data.user.id);
          onClose();
          return;
        }

        setSuccessMessage('Check your email for a confirmation link to continue.');
        return;
      }

      if (mode === 'magic_link') {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: callbackUrl,
          },
        });

        if (error) throw error;

        dispatch({ type: 'SUBMIT_SUCCEEDED' });
        setSuccessMessage('Magic link sent. Check your email to continue.');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      dispatch({ type: 'SUBMIT_SUCCEEDED' });

      if (data.user?.id) {
        onAuthSuccess(data.user.id);
        onClose();
        return;
      }

      dispatch({
        type: 'SUBMIT_FAILED',
        payload: { error: 'Authentication failed. Please try again.' },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed.';
      dispatch({
        type: 'SUBMIT_FAILED',
        payload: { error: mapAuthError(message) },
      });
    }
  };

  const handleGoogleLogin = async () => {
    setSuccessMessage(null);
    dispatch({ type: 'SUBMIT_STARTED' });

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
        },
      });

      if (error) throw error;

      dispatch({ type: 'SUBMIT_SUCCEEDED' });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Authentication failed.';
      dispatch({
        type: 'SUBMIT_FAILED',
        payload: { error: mapAuthError(message) },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle(mode)}>
      <div className="mb-5 grid grid-cols-3 gap-2">
        {(['signup', 'login', 'magic_link'] as const).map((modeOption) => (
          <Button
            key={modeOption}
            type="button"
            size="sm"
            variant={mode === modeOption ? 'primary' : 'ghost'}
            disabled={isSubmitting}
            onClick={() => switchMode(modeOption)}
          >
            {getModeLabel(modeOption)}
          </Button>
        ))}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          error={fieldErrors.email}
          disabled={isSubmitting}
          onChange={(event) =>
            dispatch({
              type: 'FIELD_UPDATED',
              payload: { field: 'email', value: event.target.value },
            })
          }
        />

        {mode !== 'magic_link' && (
          <Input
            label="Password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            value={password}
            error={fieldErrors.password}
            disabled={isSubmitting}
            onChange={(event) =>
              dispatch({
                type: 'FIELD_UPDATED',
                payload: { field: 'password', value: event.target.value },
              })
            }
          />
        )}

        {mode === 'signup' && (
          <div>
            <Checkbox
              label="I agree to the Terms and Privacy Policy."
              checked={acceptTerms}
              disabled={isSubmitting}
              onChange={(checked) =>
                dispatch({
                  type: 'FIELD_UPDATED',
                  payload: { field: 'acceptTerms', value: checked },
                })
              }
            />
            {fieldErrors.acceptTerms && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {fieldErrors.acceptTerms}
              </p>
            )}
          </div>
        )}

        {formError && (
          <p
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {formError}
          </p>
        )}

        {successMessage && (
          <p
            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
            role="status"
          >
            {successMessage}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          {getSubmitLabel(mode)}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={isSubmitting}
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </Button>
      </form>
    </Modal>
  );
};

export default AuthModal;
