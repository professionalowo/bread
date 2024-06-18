import type { ServeOptions } from "bun";
import { BreadRouter } from "./internal/router";
import type { RouteHandlerFunction } from "./internal/path/routePathMapping";
import type { MiddlewareHandler, Next } from "./internal/path/middlewarePathMapping";


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
        return this.fetch(request);
    };

    public use(path: string, handler: MiddlewareHandler,): void;
    public use(path: string, handler: Array<MiddlewareHandler>,): void;
    public use(path: string, handler: Bread,): void;

    public use(path: string, handler: MiddlewareHandler | Array<MiddlewareHandler> | Bread): void {
        this.router.addMiddleware(path, handler);
    }

    public put(path: string, handler: RouteHandlerFunction): void {
        this.router.addPut(path, handler);
    }

    public delete(path: string, handler: RouteHandlerFunction): void {
        this.router.addDelete(path, handler);
    }

    public post(path: string, handler: RouteHandlerFunction): void {
        this.router.addPost(path, handler);
    }

    public get(path: string, handler: RouteHandlerFunction): void {
        this.router.addGet(path, handler);
    }
}


export { Bread };