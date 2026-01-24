import { APP_VERSION } from '@rental-studio/core';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

import { setupErrorHandling } from './middleware/error-handler';
import apiRoutes from './routes/api';
import appRoutes from './routes/app';
import authRoutes from './routes/auth';
import indexRoutes from './routes/index';

const app = new Hono();

// Middleware
app.use(logger());
// TODO: Configure allowed origins before adding authentication (currently allows all origins)
app.use('/api/*', cors());
app.use('/static/*', serveStatic({ root: './public' }));

// Error handling
setupErrorHandling(app);

// Health check (at root level for deployment checks)
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.route('/', indexRoutes);
app.route('/auth', authRoutes);
app.route('/app', appRoutes);
app.route('/api', apiRoutes);

export default app;
