import { Hono } from 'hono';
import { Alert, Button, FormInput } from '../components';
import { authRenderer } from '../middleware/renderer';

const auth = new Hono();

// TODO: Add rate limiting middleware before implementing real auth
// to prevent brute-force attacks on login

auth.use(authRenderer);

/**
 * Get CSRF token for forms.
 * Throws in development to remind developers to implement CSRF protection.
 * In production, this would use hono/csrf middleware with session-based tokens.
 */
function getCsrfToken(): string {
  // TODO: Implement with hono/csrf middleware and session storage
  // Example: return c.get('csrfToken') from session
  if (process.env.NODE_ENV === 'production') {
    throw new Error('CSRF protection must be implemented before production deployment');
  }
  // Return empty string in development - forms will work but without CSRF protection
  return '';
}

auth.get('/login', (c) => {
  const csrfToken = getCsrfToken();

  return c.render(
    <form method="post" action="/auth/login">
      {/* CSRF protection - implement with hono/csrf middleware */}
      {csrfToken && <input type="hidden" name="_csrf" value={csrfToken} />}
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
  const csrfToken = getCsrfToken();

  return c.render(
    <form method="post" action="/auth/register">
      {/* CSRF protection - implement with hono/csrf middleware */}
      {csrfToken && <input type="hidden" name="_csrf" value={csrfToken} />}
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
  // TODO: Clear session
  return c.redirect('/');
});

auth.post('/login', (c) => {
  // TODO: Implement authentication
  return c.render(
    <>
      <Alert variant="warning">Login functionality is not yet implemented.</Alert>
      <p>
        <a href="/auth/login">← Back to login</a>
      </p>
    </>,
    { title: 'Sign In' },
  );
});

auth.post('/register', (c) => {
  // TODO: Implement registration
  return c.render(
    <>
      <Alert variant="warning">Registration functionality is not yet implemented.</Alert>
      <p>
        <a href="/auth/register">← Back to registration</a>
      </p>
    </>,
    { title: 'Sign Up' },
  );
});

export default auth;
