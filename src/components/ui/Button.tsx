import clsx from 'clsx';
import { Loader } from 'lucide-react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> {
  children: ReactNode;
  // eslint-disable-next-line react/require-default-props
  variant?: 'primary' | 'secondary' | 'ghost';
  // eslint-disable-next-line react/require-default-props
  size?: 'sm' | 'md' | 'lg';
  // eslint-disable-next-line react/require-default-props
  isLoading?: boolean;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
}

const variantClasses = {
  primary: 'bg-brand-primary text-white hover:bg-blue-600',
  secondary: 'bg-brand-secondary text-white hover:bg-emerald-600',
  ghost: 'border border-brand-primary bg-transparent text-brand-primary hover:bg-blue-50',
} as const;

const sizeClasses = {
  sm: 'min-h-9 px-3 text-sm',
  md: 'min-h-11 px-4 text-cta',
  lg: 'min-h-12 px-6 text-lg',
} as const;

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className,
  ...buttonProps
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      disabled={isDisabled}
      aria-busy={isLoading || undefined}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors duration-200',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    >
      {isLoading && (
        <>
          <Loader className="h-4 w-4 animate-spin" />
          <span className="sr-only">Loading</span>
        </>
      )}
      {children}
    </button>
  );
};

export default Button;
