import type { FC } from 'hono/jsx';

export interface LoadingIndicatorProps {
  size?: 'small' | 'medium' | 'large';
}

const sizeMap = {
  small: '1rem',
  medium: '1.5rem',
  large: '2rem',
};

export const LoadingIndicator: FC<LoadingIndicatorProps> = ({ size = 'medium' }) => {
  return (
    <span
      class="htmx-indicator"
      aria-busy="true"
      style={{
        display: 'inline-block',
        width: sizeMap[size],
        height: sizeMap[size],
      }}
    />
  );
};
