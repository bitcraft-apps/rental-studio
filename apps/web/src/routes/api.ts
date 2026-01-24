import { APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';

const route = new Hono();

route.get('/version', (c) => c.json({ version: APP_VERSION }));

export default route;
