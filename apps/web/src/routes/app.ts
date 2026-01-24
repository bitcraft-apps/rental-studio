import { Hono } from 'hono';

const appRoutes = new Hono();

// TODO: Add auth middleware when authentication is implemented
appRoutes.get('/', (c) => c.text('Main application'));

export default appRoutes;
