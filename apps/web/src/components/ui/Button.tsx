import type { FC } from 'hono/jsx';

export type ButtonVariant = 'primary' | 'secondary' | 'contrast' | 'outline';

export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  children: unknown;
  [key: string]: unknown;
}

export const Button: FC<ButtonProps> = ({
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  children,
  ...rest
}) => {
  const classNames: string[] = [];
  if (variant === 'secondary') classNames.push('secondary');
  if (variant === 'contrast') classNames.push('contrast');
  if (variant === 'outline') classNames.push('outline');

  return (
    <button
      type={type}
      class={classNames.join(' ') || undefined}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {children}
    </button>
  );
};
