import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { Button, FormInput } from '../components';
import { renderErrorPage } from '../middleware/error-handler';
import { authRenderer } from '../middleware/renderer';

const auth = new Hono();

// TODO: Add rate limiting middleware before implementing real auth
// to prevent brute-force attacks on login

// CSRF protection - validates Origin header for form submissions
auth.use(csrf());
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
  // TODO: Clear session
  return c.redirect('/');
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
