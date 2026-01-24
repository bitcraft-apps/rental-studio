import { Hono } from "hono";
import { APP_NAME } from "@rental-studio/core";

const app = new Hono();

app.get("/", (c) => {
  return c.text(`Welcome to ${APP_NAME}`);
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

export default app;
