import { APP_NAME } from '@rental-studio/core';
import { Hono } from 'hono';
import { baseRenderer } from '../middleware/renderer';

const index = new Hono();

index.use(baseRenderer);

index.get('/', (c) => {
  return c.render(
    <main class="app-container">
      <hgroup>
        <h1>Welcome to {APP_NAME}</h1>
        <p>Your rental management platform</p>
      </hgroup>
      <p>
        <a href="/auth/login">Get Started →</a>
      </p>
    </main>,
    { title: 'Home' },
  );
});

export default index;
