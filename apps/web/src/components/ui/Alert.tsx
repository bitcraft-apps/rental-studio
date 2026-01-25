import type { FC } from 'hono/jsx';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  children: unknown;
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'border-l-primary bg-primary/5',
  success: 'border-l-success bg-success/5',
  warning: 'border-l-warning bg-warning/5',
  error: 'border-l-danger bg-danger/5',
};

export const Alert: FC<AlertProps> = ({ variant = 'info', children }) => (
  <aside role="alert" class={`p-4 mb-4 border-l-4 rounded-md ${variantStyles[variant]}`}>
    {children}
  </aside>
);
