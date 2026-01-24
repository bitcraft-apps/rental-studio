import { APP_NAME } from '@rental-studio/core';
import { Hono } from 'hono';

const route = new Hono();

route.get('/', (c) => c.text(`Welcome to ${APP_NAME}`));

export default route;
