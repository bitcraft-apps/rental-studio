import type { Child, FC } from 'hono/jsx';
import type { HtmxAttributes } from '../../types/htmx';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

export interface ButtonProps extends HtmxAttributes {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  class?: string;
  children: Child;
}

export const Button: FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  class: className,
  children,
  ...htmxProps
}) => {
  // Base button styling comes from @layer base in main.css
  // Only add variant class when not primary (primary is the default)
  const variantClass = variant !== 'primary' ? variant : undefined;
  const combinedClass = [variantClass, className].filter(Boolean).join(' ') || undefined;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      class={combinedClass}
      {...htmxProps}
    >
      {children}
    </button>
  );
};
