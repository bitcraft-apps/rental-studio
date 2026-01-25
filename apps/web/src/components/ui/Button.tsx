import type { Child, FC } from 'hono/jsx';
import type { HtmxAttributes } from '../../types/htmx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface ButtonProps extends HtmxAttributes {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  children: Child;
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
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      class={variantClass}
      {...htmxProps}
    >
      {children}
    </button>
  );
};
