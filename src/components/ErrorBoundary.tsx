import type { ErrorInfo, ReactNode } from 'react';
import { Component } from 'react';
import { captureAppError } from '../services/monitoring';
import Button from './ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    captureAppError(error);
    captureAppError(new Error(errorInfo.componentStack || 'No component stack available'));
  }

  public render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-4xl items-center justify-center px-6 py-12">
          <section className="w-full max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <h1 className="text-xl font-semibold text-red-700">Something went wrong.</h1>
            <p className="mt-3 text-sm text-red-700">
              We hit an unexpected error. Please reload the page or contact support.
            </p>
            <Button className="mt-6 w-full" onClick={() => window.location.reload()}>
              Reload page
            </Button>
            <a
              href="/"
              className="mt-4 inline-block text-sm font-semibold text-brand-primary underline"
            >
              Contact support
            </a>
          </section>
        </main>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
