import type { FC } from 'hono/jsx';

export interface FormInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  // Explicit HTMX attributes for type safety
  'hx-get'?: string;
  'hx-post'?: string;
  'hx-target'?: string;
  'hx-swap'?: string;
  'hx-trigger'?: string;
}

export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  ...htmxProps
}) => (
  <div class="mb-4">
    <label for={name}>
      {label}
      {required && <span class="text-danger"> *</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      required={required}
      value={value}
      aria-invalid={error ? true : undefined}
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
