import { APP_NAME } from '@rental-studio/core';
import type { Child, FC } from 'hono/jsx';

export interface AppLayoutProps {
  children: Child;
}

// Calculate once at module load; updates when server restarts in new year
const COPYRIGHT_YEAR = new Date().getFullYear();

export const AppLayout: FC<AppLayoutProps> = ({ children }) => {
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
                  <a href="/app/tenants">Tenants</a>
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
          © {COPYRIGHT_YEAR} {APP_NAME}. All rights reserved.
        </small>
      </footer>
    </>
  );
};
