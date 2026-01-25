import type { FC } from 'hono/jsx';

export interface FormInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date';
  placeholder?: string;
  required?: boolean;
  error?: string;
  value?: string;
  [key: string]: unknown;
}

export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  error,
  value,
  ...rest
}) => {
  return (
    <label>
      {label}
      {required && <span aria-hidden="true"> *</span>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        {...rest}
      />
      {error && (
        <small id={`${name}-error`} style={{ color: 'var(--pico-del-color)' }}>
          {error}
        </small>
      )}
    </label>
  );
};
