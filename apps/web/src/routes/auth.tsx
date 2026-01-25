import type { Context, Next } from 'hono';
import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { HTTPException } from 'hono/http-exception';
import { Button, FormInput } from '../components';
import { renderErrorPage } from '../middleware/error-handler';
import { authRenderer } from '../middleware/renderer';

const auth = new Hono();

// TODO: Add rate limiting middleware before implementing real auth
// to prevent brute-force attacks on login

/**
 * Get allowed origins for CSRF validation.
 * In development, allows localhost. In production, requires APP_URL env var.
 */
function getAllowedOrigins(): string[] {
  const origins: string[] = [];

  // Always allow localhost in development
  if (process.env.NODE_ENV !== 'production') {
    origins.push('http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000');
  }

  // Add production origin from environment
  if (process.env.APP_URL) {
    origins.push(process.env.APP_URL);
  }

  return origins;
}

// Create CSRF middleware instance once at module load time
const csrfMiddleware = csrf({
  origin: (origin) => getAllowedOrigins().includes(origin),
});

/**
 * Custom CSRF middleware that wraps Hono's csrf() with a user-friendly error page.
 * The default CSRF middleware throws an HTTPException; this catches it and provides
 * a styled error page for a consistent user experience.
 */
const csrfWithErrorPage = async (c: Context, next: Next) => {
  try {
    return await csrfMiddleware(c, next);
  } catch (err) {
    // CSRF middleware throws HTTPException with status 403 on validation failure
    if (err instanceof HTTPException && err.status === 403) {
      return c.html(
        renderErrorPage(
          403,
          'Invalid Request',
          'Your session may have expired. Please refresh the page and try again.',
        ),
        403,
      );
    }
    // Re-throw other errors to be handled by global error handler
    throw err;
  }
};

auth.use(csrfWithErrorPage);
auth.use(authRenderer);

auth.get('/login', (c) => {
  return c.render(
    <form method="post" action="/auth/login">
      <FormInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        required
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Your password"
        autocomplete="current-password"
        required
      />
      <Button type="submit">Sign In</Button>
      <p class="mt-4 text-center">
        <small>
          Don't have an account? <a href="/auth/register">Sign up</a>
        </small>
      </p>
    </form>,
    { title: 'Sign In' },
  );
});

auth.get('/register', (c) => {
  return c.render(
    <form method="post" action="/auth/register">
      <FormInput
        name="name"
        label="Full Name"
        type="text"
        placeholder="John Doe"
        autocomplete="name"
        required
      />
      <FormInput
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
        autocomplete="email"
        required
      />
      <FormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Choose a password"
        autocomplete="new-password"
        required
      />
      <Button type="submit">Create Account</Button>
      <p class="mt-4 text-center">
        <small>
          Already have an account? <a href="/auth/login">Sign in</a>
        </small>
      </p>
    </form>,
    { title: 'Sign Up' },
  );
});

auth.post('/logout', (c) => {
  // TODO: Implement session invalidation
  return c.html(
    renderErrorPage(501, 'Not Implemented', 'Logout functionality is not yet implemented.'),
    501,
  );
});

auth.post('/login', (c) => {
  // TODO: Implement authentication
  return c.html(
    renderErrorPage(501, 'Not Implemented', 'Login functionality is not yet implemented.'),
    501,
  );
});

auth.post('/register', (c) => {
  // TODO: Implement registration
  return c.html(
    renderErrorPage(501, 'Not Implemented', 'Registration functionality is not yet implemented.'),
    501,
  );
});

export default auth;
