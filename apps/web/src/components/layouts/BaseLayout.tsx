import { APP_NAME } from '@rental-studio/core';
import type { Child, FC } from 'hono/jsx';

export interface BaseLayoutProps {
  title?: string;
  children: Child;
}

export const BaseLayout: FC<BaseLayoutProps> = ({ title, children }) => {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/static/styles.css" />
        <script defer src="/static/htmx.min.js" />
      </head>
      <body hx-boost="true">{children}</body>
    </html>
  );
};
