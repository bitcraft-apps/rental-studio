import { APP_NAME } from '@rental-studio/core';
import type { FC } from 'hono/jsx';

export interface BaseLayoutProps {
  title?: string;
  children: unknown;
}

export const BaseLayout: FC<BaseLayoutProps> = ({ title, children }) => {
  const pageTitle = title ? `${title} | ${APP_NAME}` : APP_NAME;

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{pageTitle}</title>
        {/* Self-hosted Tailwind CSS */}
        <link rel="stylesheet" href="/static/styles.css" />
        {/* HTMX with Subresource Integrity */}
        <script
          src="https://unpkg.com/htmx.org@2.0.4"
          integrity="sha384-HGfztofotfshcF7+8n44JQL2oJmowVChPTg48S+jvZoztPfvwD79OC/LTtG6dMp+"
          crossorigin="anonymous"
        />
      </head>
      <body hx-boost="true">{children}</body>
    </html>
  );
};
