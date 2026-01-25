import type { FC } from 'hono/jsx';
import type { HtmxAttributes } from '../../types/htmx';

export interface FormInputProps extends HtmxAttributes {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  autocomplete?: string;
}

export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  autocomplete,
  ...htmxProps
}) => (
  <div class="mb-4">
    <label for={name}>
      {label}
      {required && (
        <>
          <span class="text-danger" aria-hidden="true">
            {' '}
            *
          </span>
          <span class="sr-only"> (required)</span>
        </>
      )}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      required={required}
      value={value}
      autocomplete={autocomplete}
      aria-invalid={error ? 'true' : undefined}
      aria-describedby={error ? `${name}-error` : undefined}
      {...htmxProps}
    />
    {error && (
      <small id={`${name}-error`} class="text-danger">
        {error}
      </small>
    )}
  </div>
);
