import type { Child, FC } from 'hono/jsx';

export interface CardProps {
  header?: Child;
  footer?: Child;
  children: Child;
}

/**
 * Card component using semantic <article> element.
 * Base styling provided by @layer base in main.css.
 */
export const Card: FC<CardProps> = ({ header, footer, children }) => (
  <article>
    {header && <header>{header}</header>}
    {children}
    {footer && <footer>{footer}</footer>}
  </article>
);
