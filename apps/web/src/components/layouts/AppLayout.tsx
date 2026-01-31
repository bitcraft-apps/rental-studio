import { APP_NAME } from '@rental-studio/core';
import type { Child, FC } from 'hono/jsx';

export interface AppLayoutProps {
  children: Child;
}

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
  // Calculate per-request to ensure correct year across New Year's boundary.
  // Do NOT cache at module level - SSR processes can run for months.
  const copyrightYear = new Date().getFullYear();

  return (
    <>
      <header>
        <nav class="app-container py-4">
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
                  <a href="/app/renters">Renters</a>
                </li>
              </ul>
            </div>
            <form method="post" action="/auth/logout" class="inline">
              <button type="submit" class="logout-btn">
                Logout
              </button>
            </form>
          </div>
        </nav>
      </header>
      <main class="app-container py-8">{children}</main>
      <footer class="app-container">
        <small>
          © {copyrightYear} {APP_NAME}. All rights reserved.
        </small>
      </footer>
    </>
  );
};
