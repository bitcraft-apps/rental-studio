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
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
        />
        <script src="https://unpkg.com/htmx.org@2.0.4" />
        <style>
          {`
            .htmx-indicator {
              display: none;
            }
            .htmx-request .htmx-indicator {
              display: inline-block;
            }
            .htmx-request.htmx-indicator {
              display: inline-block;
            }
          `}
        </style>
      </head>
      <body hx-boost="true">{children}</body>
    </html>
  );
};
