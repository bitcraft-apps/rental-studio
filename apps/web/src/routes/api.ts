import { APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';

const api = new Hono();

api.get('/version', (c) => c.json({ version: APP_VERSION }));

// Test-only route for error handling verification
if (process.env.NODE_ENV === 'test') {
  api.get('/test-error', () => {
    throw new Error('Test error');
  });
}

export default api;
