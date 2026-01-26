import type { PropsWithChildren } from 'hono/jsx';
import { jsxRenderer } from 'hono/jsx-renderer';
import { AppLayout } from '../components/layouts/AppLayout';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { BaseLayout } from '../components/layouts/BaseLayout';

type RendererProps = PropsWithChildren<{ title?: string }>;

/**
 * Base renderer - wraps content in BaseLayout with Tailwind CSS and HTMX
 */
export const baseRenderer = jsxRenderer(({ children, title }: RendererProps) => {
  return <BaseLayout title={title}>{children}</BaseLayout>;
});

/**
 * App renderer - for authenticated application pages with navigation
 */
export const appRenderer = jsxRenderer(({ children, title }: RendererProps) => {
  return (
    <BaseLayout title={title}>
      <AppLayout>{children}</AppLayout>
    </BaseLayout>
  );
});

/**
 * Auth renderer - minimal layout for login/signup pages
 */
export const authRenderer = jsxRenderer(({ children, title }: RendererProps) => {
  return (
    <BaseLayout title={title}>
      <AuthLayout>{children}</AuthLayout>
    </BaseLayout>
  );
});
