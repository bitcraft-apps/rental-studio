import { APP_NAME } from '@rental-studio/core';
import type { FC } from 'hono/jsx';

export interface AuthLayoutProps {
  children: unknown;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main class="container">
      <article class="max-w-md mx-auto mt-16">
        <header>
          <hgroup>
            <h1>{APP_NAME}</h1>
            <p>Rental Management Platform</p>
          </hgroup>
        </header>
        {children}
      </article>
    </main>
  );
};
