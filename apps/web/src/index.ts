import { join } from 'node:path';
import { APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';

import { csrfProtection } from './middleware/csrf';
import { setupErrorHandling } from './middleware/error-handler';
import { requestId } from './middleware/request-id';
import api from './routes/api';
import appRouter from './routes/app';
import auth from './routes/auth';
import index from './routes/index';

const app = new Hono();

// Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}

// Request ID for tracing and log correlation (must be before other middleware)
app.use(requestId);

/**
 * CSRF Protection
 *
 * Applied to routes that handle state-changing requests (POST, PUT, DELETE, PATCH).
 * Hono's csrf() middleware validates Origin header on non-safe methods;
 * safe methods (GET, HEAD, OPTIONS) pass through unvalidated.
 *
 * Why protect /api/* routes?
 * - HTMX requests use cookie-based sessions (same-origin)
 * - Without CSRF, a malicious site could submit API requests using user's cookies
 * - If you add token-based auth (Authorization header), CSRF protection is not needed
 *   for those endpoints since the token is not automatically attached like cookies
 *
 * For machine-to-machine API clients using token auth, you can:
 * 1. Use a separate /api/v1/* route without CSRF, OR
 * 2. Keep CSRF and have clients send valid Origin header
 */
app.use('/auth/*', csrfProtection);
app.use('/app/*', csrfProtection);
app.use('/api/*', csrfProtection);

const STATIC_PREFIX = '/static';
app.use(
  `${STATIC_PREFIX}/*`,
  serveStatic({
    root: join(import.meta.dir, '../public/dist'),
    rewriteRequestPath: (path) => path.slice(STATIC_PREFIX.length),
  }),
);

// Health check (at root level for deployment checks)
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.route('/', index);
app.route('/auth', auth);
app.route('/app', appRouter);
app.route('/api', api);

// Error handling (must be registered after routes)
setupErrorHandling(app);

export default app;
