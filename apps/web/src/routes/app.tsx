import { Hono } from 'hono';
import { Card } from '../components';
import { requireAuth } from '../middleware/auth';
import { appRenderer } from '../middleware/renderer';

const appRouter = new Hono();

appRouter.use(requireAuth);
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

appRouter.get('/tenants', (c) => {
  return c.render(
    <>
      <h1>Tenants</h1>
      <p>Tenant management coming soon.</p>
      <a href="/app">← Back to Dashboard</a>
    </>,
    { title: 'Tenants' },
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
