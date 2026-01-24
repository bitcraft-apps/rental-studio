import { Hono } from 'hono';

const app = new Hono();

// TODO: Add auth middleware when authentication is implemented
app.get('/', (c) => c.text('Main application'));

export default app;
