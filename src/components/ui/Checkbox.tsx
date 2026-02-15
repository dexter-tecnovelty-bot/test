import clsx from 'clsx';
import { Check } from 'lucide-react';
import { useId } from 'react';
import type { InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = ({
  label,
  checked,
  onChange,
  id,
  className,
  disabled = false,
  ...props
}: CheckboxProps) => {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;

  return (
    <label
      htmlFor={checkboxId}
      className={clsx(
        'inline-flex cursor-pointer items-start gap-3 text-sm text-slate-800',
        disabled && 'cursor-not-allowed opacity-60',
        className
      )}
    >
      <span className="relative mt-0.5">
        <input
          id={checkboxId}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
        <span
          aria-hidden="true"
          className={clsx(
            'flex h-5 w-5 items-center justify-center rounded border transition-colors duration-200',
            'border-slate-300 bg-white peer-checked:border-brand-primary peer-checked:bg-brand-primary',
            'peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand-primary'
          )}
        >
          <Check className="h-3.5 w-3.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100" />
        </span>
      </span>
      <span>{label}</span>
    </label>
  );
};

export default Checkbox;
