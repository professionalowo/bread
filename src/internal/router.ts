import type { MiddlewareHandler } from "../bread";

class BreadRouter {
    protected handlers: Map<string, MiddlewareHandler[]> = new Map<string, MiddlewareHandler[]>();
    public addMiddleware(path: string, handler: MiddlewareHandler | ReadonlyArray<MiddlewareHandler>): void {
        if (handler instanceof Array) {
            this.handlers.set(path, [...(this.handlers.get(path) || []), ...handler]);
        }
        else {
            this.handlers.set(path, [...(this.handlers.get(path) || []), handler]);
        }
    }
    public async applyMiddlewares(request: Request): Promise<Response> {
        const handlers = this.getHandlers(request);
        let res = new Response("Hello from BreadRouter!");
        for (const handler of handlers) {
            res = await handler(request);
        }
        return res;
    }

    private getHandlers(request: Request): MiddlewareHandler[] {
        const { pathname } = new URL(request.url);
        const handlers = this.handlers.get(pathname) || [];
        return handlers;
    }
}

export { BreadRouter }