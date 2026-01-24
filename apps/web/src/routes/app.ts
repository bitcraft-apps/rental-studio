import { Hono } from 'hono';

const route = new Hono();

// TODO: Add auth middleware when authentication is implemented
route.get('/', (c) => c.text('Main application'));

export default route;
