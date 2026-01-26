import type { FC } from 'hono/jsx';
import type { HtmxAttributes } from '../../types/htmx';

export interface FormInputProps extends HtmxAttributes {
  name: string;
  label: string;
  /** Optional custom id. Defaults to name. Use when multiple forms on a page have same field names. */
  id?: string;
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
  id,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  autocomplete,
  ...htmxProps
}) => {
  const inputId = id || name;
  const errorId = `${inputId}-error`;

  return (
    <div class="mb-4">
      <label for={inputId}>
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
        id={inputId}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        autocomplete={autocomplete}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        {...htmxProps}
      />
      {error && (
        <small id={errorId} class="text-danger">
          {error}
        </small>
      )}
    </div>
  );
};
