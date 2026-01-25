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

// CSRF protection for state-changing requests (POST, PUT, DELETE, PATCH).
// Hono's csrf() middleware only validates Origin on non-safe methods;
// safe methods (GET, HEAD, OPTIONS) pass through unvalidated.
// API routes are also protected since they may be called via HTMX with cookie auth.
// If using token-based auth (Authorization header) for API, CSRF can be removed from /api/*.
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
