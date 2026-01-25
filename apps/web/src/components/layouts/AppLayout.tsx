import { APP_NAME } from '@rental-studio/core';
import type { FC } from 'hono/jsx';

export interface AppLayoutProps {
  children: unknown;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <header>
        <nav class="container">
          <ul>
            <li>
              <strong>{APP_NAME}</strong>
            </li>
          </ul>
          <ul>
            <li>
              <a href="/app">Dashboard</a>
            </li>
            <li>
              <a href="/app/properties">Properties</a>
            </li>
            <li>
              <a href="/app/tenants">Tenants</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="/auth/logout" class="secondary">
                Logout
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main class="container">{children}</main>
      <footer class="container">
        <small>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </small>
      </footer>
    </>
  );
};
