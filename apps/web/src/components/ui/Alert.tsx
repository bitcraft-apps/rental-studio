import type { FC } from 'hono/jsx';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  dismissible?: boolean;
  children: unknown;
}

const variantStyles: Record<AlertVariant, string> = {
  info: 'var(--pico-primary)',
  success: 'var(--pico-ins-color)',
  warning: 'var(--pico-mark-background-color)',
  error: 'var(--pico-del-color)',
};

export const Alert: FC<AlertProps> = ({ variant = 'info', dismissible = false, children }) => {
  return (
    <aside
      role="alert"
      style={{
        padding: 'var(--pico-spacing)',
        marginBottom: 'var(--pico-spacing)',
        borderLeft: `4px solid ${variantStyles[variant]}`,
        backgroundColor: 'var(--pico-card-background-color)',
        borderRadius: 'var(--pico-border-radius)',
      }}
    >
      {dismissible && (
        <button
          type="button"
          class="close"
          aria-label="Close"
          style={{ float: 'right', background: 'none', border: 'none' }}
        >
          ×
        </button>
      )}
      {children}
    </aside>
  );
};
