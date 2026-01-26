import 'hono';

declare module 'hono' {
  interface ContextRenderer {
    // biome-ignore lint/style/useShorthandFunctionType: Module augmentation requires interface syntax for declaration merging
    (content: string | Promise<string>, props?: { title?: string }): Response | Promise<Response>;
  }
}
