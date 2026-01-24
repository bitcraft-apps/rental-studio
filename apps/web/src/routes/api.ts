import { APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';

const api = new Hono();

api.get('/version', (c) => c.json({ version: APP_VERSION }));

export default api;
