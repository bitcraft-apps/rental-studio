import type { FC } from 'hono/jsx';

export interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles: Record<NonNullable<LoadingIndicatorProps['size']>, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

/**
 * Spinner that appears when HTMX request is in progress.
 * Add to an element with hx-indicator pointing to this element's ID,
 * or place inside an element making the request.
 */
export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ size = 'md' }) => (
  <span
    class={`htmx-indicator inline-block ${sizeStyles[size]} animate-spin rounded-full border-2 border-gray-300 border-t-primary`}
    aria-hidden="true"
  />
);
