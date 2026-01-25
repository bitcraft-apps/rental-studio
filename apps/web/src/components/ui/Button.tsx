import type { FC } from 'hono/jsx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  children: unknown;
  // Explicit HTMX attributes for type safety
  'hx-get'?: string;
  'hx-post'?: string;
  'hx-put'?: string;
  'hx-delete'?: string;
  'hx-target'?: string;
  'hx-swap'?: string;
  'hx-trigger'?: string;
  'hx-indicator'?: string;
}

export const Button: FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  children,
  ...htmxProps
}) => {
  // Base button styling comes from @layer base in main.css
  // Only add variant class when not primary (primary is the default)
  const variantClass = variant !== 'primary' ? variant : undefined;

  return (
    <button
      type={type}
      class={variantClass}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...htmxProps}
    >
      {children}
    </button>
  );
};
