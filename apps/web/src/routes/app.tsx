import { Hono } from 'hono';
import { Card } from '../components';
import { requireAuth } from '../middleware/auth';
import { appRenderer } from '../middleware/renderer';
import { withTenant } from '../middleware/tenant';

const appRouter = new Hono();

/**
 * Middleware order:
 * 1. CSRF protection (applied at app level in index.ts, runs first)
 * 2. Tenant resolution (404s when subdomain is missing/invalid)
 * 3. Authentication check (redirects to login if not authenticated)
 * 4. Renderer (wraps response in AppLayout)
 *
 * Note: CSRF runs before auth, so unauthenticated POST requests to /app/*
 * will receive a 403 CSRF error instead of a redirect to login. This is
 * intentional - it prevents CSRF probing attacks against protected routes.
 */
appRouter.use(withTenant);
appRouter.use(requireAuth);
appRouter.use(appRenderer);

appRouter.get('/', (c) => {
  const tenant = c.get('tenant');
  return c.render(
    <>
      <h1>Dashboard</h1>
      {tenant ? <p class="text-muted">Workspace: {tenant.slug}</p> : null}
      <div class="app-grid">
        <Card header={<strong>Properties</strong>}>
          <p>Manage your rental properties</p>
          <a href="/app/properties">View Properties →</a>
        </Card>
        <Card header={<strong>Renters</strong>}>
          <p>Manage your renters</p>
          <a href="/app/renters">View Renters →</a>
        </Card>
        <Card header={<strong>Payments</strong>}>
          <p>Track rent payments</p>
          <a href="/app/payments">View Payments →</a>
        </Card>
      </div>
    </>,
    { title: 'Dashboard' },
  );
});

// Placeholder routes for dashboard links
appRouter.get('/properties', (c) => {
  return c.render(
    <>
      <h1>Properties</h1>
      <p>Property management coming soon.</p>
      <a href="/app">← Back to Dashboard</a>
    </>,
    { title: 'Properties' },
  );
});

appRouter.get('/renters', (c) => {
  return c.render(
    <>
      <h1>Renters</h1>
      <p>Renter management coming soon.</p>
      <a href="/app">← Back to Dashboard</a>
    </>,
    { title: 'Renters' },
  );
});

appRouter.get('/payments', (c) => {
  return c.render(
    <>
      <h1>Payments</h1>
      <p>Payment tracking coming soon.</p>
      <a href="/app">← Back to Dashboard</a>
    </>,
    { title: 'Payments' },
  );
});

export default appRouter;
