import clsx from 'clsx';
import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  // eslint-disable-next-line react/require-default-props
  error?: string;
}

const Input = ({ label, error, id, className, ...inputProps }: InputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-slate-800">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={clsx(
          'w-full rounded-md border bg-white px-3 py-2 text-body text-slate-900 shadow-sm transition-colors duration-200',
          'placeholder:text-slate-400 focus:border-brand-primary focus:outline-none',
          {
            'border-slate-300': !error,
            'border-red-500 focus:border-red-500': Boolean(error),
          },
          className
        )}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...inputProps}
      />
      {error && (
        <p id={errorId} className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
