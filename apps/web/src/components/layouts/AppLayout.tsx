import { APP_NAME } from '@rental-studio/core';
import type { FC } from 'hono/jsx';

export interface AppLayoutProps {
  children: unknown;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  return (
    <>
      <header>
        <nav class="container py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-6">
              <strong class="text-lg">{APP_NAME}</strong>
              <ul class="flex gap-4">
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
            </div>
            <a href="/auth/logout" class="text-gray-500 hover:text-gray-700">
              Logout
            </a>
          </div>
        </nav>
      </header>
      <main class="container py-8">{children}</main>
      <footer class="container">
        <small>
          © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </small>
      </footer>
    </>
  );
};
