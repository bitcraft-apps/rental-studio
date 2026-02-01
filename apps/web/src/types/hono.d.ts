import 'hono';

declare module 'hono' {
  interface ContextVariableMap {
    requestId: string;
    tenant?: { slug: string; host: string };
  }

  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: Module augmentation requires interface syntax for declaration merging
    (content: string | Promise<string>, props?: { title?: string }): Response | Promise<Response>;
  }
}
