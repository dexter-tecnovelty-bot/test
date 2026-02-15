interface LoadingSpinnerProps {
  // eslint-disable-next-line react/require-default-props
  label?: string;
}

const LoadingSpinner = ({ label = 'Loading content' }: LoadingSpinnerProps) => (
  <div
    className="flex min-h-[12rem] w-full items-center justify-center"
    role="status"
    aria-live="polite"
  >
    <div className="flex items-center gap-3 text-slate-700">
      <span
        className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand-primary"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  </div>
);

export default LoadingSpinner;
