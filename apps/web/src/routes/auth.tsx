import { Hono } from 'hono';
import { Button, FormInput } from '../components';
import { authRenderer } from '../middleware/renderer';

const auth = new Hono();

// TODO: Add rate limiting middleware before implementing real auth
// to prevent brute-force attacks on login

auth.use(authRenderer);

auth.get('/login', (c) => {
  // TODO: Generate CSRF token from session (use hono/csrf middleware)
  const csrfToken = 'CSRF_TOKEN_PLACEHOLDER';

  return c.render(
    <form method="post" action="/auth/login">
      {/* CSRF protection - implement with hono/csrf middleware */}
      <input type="hidden" name="_csrf" value={csrfToken} />
      <FormInput name="email" label="Email" type="email" placeholder="you@example.com" required />
      <FormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Your password"
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
  // TODO: Generate CSRF token from session (use hono/csrf middleware)
  const csrfToken = 'CSRF_TOKEN_PLACEHOLDER';

  return c.render(
    <form method="post" action="/auth/register">
      {/* CSRF protection - implement with hono/csrf middleware */}
      <input type="hidden" name="_csrf" value={csrfToken} />
      <FormInput name="name" label="Full Name" type="text" placeholder="John Doe" required />
      <FormInput name="email" label="Email" type="email" placeholder="you@example.com" required />
      <FormInput
        name="password"
        label="Password"
        type="password"
        placeholder="Choose a password"
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

export default auth;
