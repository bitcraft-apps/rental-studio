import { Hono } from 'hono';

const route = new Hono();

// Placeholder routes - to be implemented with actual authentication
route.get('/login', (c) => c.text('Login page'));
route.get('/logout', (c) => c.text('Logout'));

export default route;
