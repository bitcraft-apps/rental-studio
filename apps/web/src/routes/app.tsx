import { Hono } from 'hono';
import { Card } from '../components';
import { appRenderer } from '../middleware/renderer';

const appRouter = new Hono();

// TODO: Add auth middleware when authentication is implemented
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
