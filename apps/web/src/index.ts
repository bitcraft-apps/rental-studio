import { APP_NAME, APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text(`Welcome to ${APP_NAME}`);
});

app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  });
});

export default app;
