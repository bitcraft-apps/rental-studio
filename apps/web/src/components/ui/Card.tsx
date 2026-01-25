import type { FC } from 'hono/jsx';

export interface CardProps {
  header?: unknown;
  footer?: unknown;
  children: unknown;
}

export const Card: FC<CardProps> = ({ header, footer, children }) => {
  return (
    <article>
      {header && <header>{header}</header>}
      {children}
      {footer && <footer>{footer}</footer>}
    </article>
  );
};
