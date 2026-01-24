import { join } from 'node:path';
import { APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { logger } from 'hono/logger';

import { setupErrorHandling } from './middleware/error-handler';
import api from './routes/api';
import appRoutes from './routes/app';
import auth from './routes/auth';
import index from './routes/index';

const app = new Hono();

// Middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(logger());
}
app.use(
  '/static/*',
  serveStatic({
    root: join(import.meta.dir, '../public'),
    rewriteRequestPath: (path) => path.replace('/static', ''),
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
app.route('/app', appRoutes);
app.route('/api', api);

// Error handling (must be registered after routes)
setupErrorHandling(app);

export default app;
