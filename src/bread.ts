import type { ServeOptions } from "bun";
import { BreadRouter } from "./internal/router";

export type MiddlewareHandler = (request: Request, next: Next) => Response | Promise<Response>;
export type Next = {
    (): Promise<Response>
}
export type BreadOptions = Partial<{ port: number }>;

/**
 * @implements {ServeOptions}
 */
class Bread implements ServeOptions {
    protected readonly router = new BreadRouter();
    public readonly port?: number;
    constructor({ port }: BreadOptions = { port: 3000 }) {
        this.port = port;
    }

    public fetch = async (request: Request): Promise<Response> => {
        return this.router.applyMiddlewares(request);
    }

    public middleware = async (request: Request, next: Next): Promise<Response> => {
        await next();
        return this.fetch(request);
    };

    public use(path: string, handler: MiddlewareHandler,): void;
    public use(path: string, handler: ReadonlyArray<MiddlewareHandler>,): void;
    public use(path: string, handler: Bread,): void;

    public use(path: string, handler: MiddlewareHandler | ReadonlyArray<MiddlewareHandler> | Bread): void {
        if (handler instanceof Bread) {
            this.router.addMiddleware(path, handler.middleware);
        } else {
            this.router.addMiddleware(path, handler);
        }

    }
}


export { Bread };