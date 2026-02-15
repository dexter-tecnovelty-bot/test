import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import supabase from '../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveSession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          setError('Your session is invalid or has expired. Please sign in again.');
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          throw userError ?? new Error('Authentication failed. Please try again.');
        }

        navigate('/', { replace: true });
      } catch (caughtError) {
        const message =
          caughtError instanceof Error ? caughtError.message : 'Authentication failed.';
        setError(message);
      }
    };

    resolveSession().catch(() => undefined);
  }, [navigate]);

  if (!error) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
        <section className="text-center">
          <h1 className="text-2xl font-semibold text-slate-900">Completing sign-in...</h1>
          <p className="mt-3 text-slate-600">Please wait while we verify your session.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h1 className="text-xl font-semibold text-red-700">Authentication error</h1>
        <p className="mt-3 text-sm text-red-700">{error}</p>
        <Button className="mt-6 w-full" onClick={() => navigate('/', { replace: true })}>
          Return Home
        </Button>
        <p className="mt-4 text-sm text-slate-600">
          Need help?{' '}
          <Link to="/" className="font-semibold text-brand-primary underline">
            Contact support
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AuthCallback;
