import clsx from 'clsx';
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
        {
          'bg-brand-primary text-white hover:bg-blue-600': variant === 'primary',
          'bg-brand-secondary text-white hover:bg-emerald-600': variant === 'secondary',
          'border border-brand-primary bg-transparent text-brand-primary hover:bg-blue-50':
            variant === 'ghost',
          'min-h-9 px-3 text-sm': size === 'sm',
          'min-h-11 px-4 text-cta': size === 'md',
          'min-h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...buttonProps}
    >
      {isLoading && (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span className="sr-only">Loading</span>
        </>
      )}
      {children}
    </button>
  );
};

export default Button;
