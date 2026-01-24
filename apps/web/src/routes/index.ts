import { APP_NAME } from '@rental-studio/core';
import { Hono } from 'hono';

const index = new Hono();

index.get('/', (c) => c.text(`Welcome to ${APP_NAME}`));

export default index;
