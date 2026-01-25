import { Hono } from 'hono';
import { Card } from '../components';
import { appRenderer } from '../middleware/renderer';

const appRouter = new Hono();

// Placeholder auth middleware - redirects to login until real auth is implemented
// TODO: Replace with actual session/JWT validation
appRouter.use(async (c, next) => {
  // When auth is implemented, check session/token here
  // For now, allow access but log warning in development
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[AUTH] Unprotected access to ${c.req.path} - auth middleware not yet implemented`,
    );
  }
  await next();
});

appRouter.use(appRenderer);

appRouter.get('/', (c) => {
  return c.render(
    <>
      <h1>Dashboard</h1>
      <div class="app-grid">
        <Card header={<strong>Properties</strong>}>
          <p>Manage your rental properties</p>
          <a href="/app/properties">View Properties →</a>
        </Card>
        <Card header={<strong>Tenants</strong>}>
          <p>Manage your tenants</p>
          <a href="/app/tenants">View Tenants →</a>
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

export default appRouter;
