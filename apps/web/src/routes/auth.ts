import { Hono } from 'hono';

const auth = new Hono();

// TODO: Add rate limiting middleware before implementing real auth
// to prevent brute-force attacks on login

// Placeholder routes - to be implemented with actual authentication
auth.get('/login', (c) => c.text('Login page'));
auth.post('/logout', (c) => c.text('Logout'));

export default auth;
