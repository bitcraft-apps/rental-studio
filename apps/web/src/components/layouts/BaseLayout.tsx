import { APP_NAME } from '@rental-studio/core';
import type { Child, FC } from 'hono/jsx';

export interface BaseLayoutProps {
  title?: string;
  description?: string;
  children: Child;
}

export const BaseLayout: FC<BaseLayoutProps> = ({ title, description, children }) => {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;
  const metaDescription =
    description || 'Rental management platform for property owners and managers';

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={metaDescription} />
        <title>{pageTitle}</title>
        <link rel="stylesheet" href="/static/styles.css" />
        {/*
          HTMX loaded locally from node_modules (copied via build:assets script).
          hx-boost on body enables AJAX navigation for all links/forms by default.
          Use hx-boost="false" on elements that need native behavior (file downloads, external links).
        */}
        <script defer src="/static/htmx.min.js"></script>
      </head>
      <body hx-boost="true">{children}</body>
    </html>
  );
};
