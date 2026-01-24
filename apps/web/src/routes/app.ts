import { Hono } from 'hono';

const appRouter = new Hono();

// TODO: Add auth middleware when authentication is implemented
appRouter.get('/', (c) => c.text('Main application'));

export default appRouter;
