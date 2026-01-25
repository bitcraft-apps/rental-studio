import { APP_NAME } from '@rental-studio/core';
import type { FC } from 'hono/jsx';

export interface AuthLayoutProps {
  children: unknown;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main class="container">
      <article style={{ maxWidth: '400px', margin: '4rem auto' }}>
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
