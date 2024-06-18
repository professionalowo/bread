import type { MiddlewareHandler, Next } from "../bread";

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
        return this.executeHandlers(request, handlers);
    }

    private getHandlers(request: Request): MiddlewareHandler[] {
        const { pathname } = new URL(request.url);
        const handlers = this.handlers.get(pathname) || [];
        return handlers;
    }

    private async executeHandlers(request: Request, handlers: MiddlewareHandler[]): Promise<Response> {
        let index = -1;

        const next = async (): Promise<Response> => {
            index++;
            if (index < handlers.length) {
                console.log(index);
                return handlers[index](request, next);
            } else {
                // Default response if no middleware provides a response
                //TODO: Call route handlers here
                return new Response('Not Found', { status: 404 });
            }
        };

        return next();
    }
}

export { BreadRouter }