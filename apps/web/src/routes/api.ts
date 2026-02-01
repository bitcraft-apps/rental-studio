import { APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';
import { withTenant } from '../middleware/tenant';

const api = new Hono();

api.use(withTenant);
api.get('/version', (c) => c.json({ version: APP_VERSION }));

export default api;
