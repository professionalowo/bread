import type { Server } from "bun";
import { BreadContext } from "./context/context";
import { MiddlewarePathMapping, type MiddlewareHandler } from "./path/middlewarePathMapping";
import { type PathMappingHandler } from "./path/pathMapping";
import { RoutePathMapping, type RouteHandlerFunction } from "./path/routePathMapping";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
class BreadRouter {
    protected handlers: Record<HttpMethod, RoutePathMapping> = {
        GET: new RoutePathMapping(),
        POST: new RoutePathMapping(),
        PUT: new RoutePathMapping(),
        DELETE: new RoutePathMapping()
    }
    protected middleware: MiddlewarePathMapping = new MiddlewarePathMapping();

    public addMiddleware(path: string, handler: MiddlewareHandler | Array<MiddlewareHandler>): void {
        this.middleware.add(path, handler);
    }

    public addPut(path: string, handler: RouteHandlerFunction): void {
        this.handlers.PUT.add(path, handler);
    }

    public addDelete(path: string, handler: RouteHandlerFunction): void {
        this.handlers.DELETE.add(path, handler);
    }

    public addPost(path: string, handler: RouteHandlerFunction): void {
        this.handlers.POST.add(path, handler);
    }

    public addGet(path: string, handler: RouteHandlerFunction): void {
        this.handlers.GET.add(path, handler);
    }

    public async applyMiddlewares(request: Request, server?: Server): Promise<Response> {
        const handlers = this.middleware.getHandlers(new URL(request.url).pathname);
        return this.executeHandlers(request, handlers, server);
    }

    private async executeHandlers(request: Request, handlers: PathMappingHandler<MiddlewareHandler>[], server?: Server): Promise<Response> {
        let index = -1;
        const next = async (): Promise<Response> => {
            index++;
            if (index < handlers.length) {
                const { path, handler } = handlers[index];
                if (typeof handler === "object") {
                    let url = request.url.replace(path, "");
                    if (url === "") {
                        url = "/";
                    }
                    const context = new BreadContext(new Request(url, request), server);
                    return handler.middleware(context, next);
                }
                return handler(new BreadContext(request, server), next);
            } else {
                const handler = this.getMethodHandler(request);

                if (typeof handler === "function") {
                    return handler(new BreadContext(request, server));
                }
                // Default response if no middleware provides a response
                return new Response('Not Found', { status: 404 });
            }
        };

        return next();
    }

    private getMethodHandler({ method, url }: Request): RouteHandlerFunction | undefined {
        const { pathname } = new URL(url);
        if (isHttpMethod(method)) {
            return this.handlers[method].getMostSpecificHandler(pathname)?.handler;
        }
        throw new Error(`Method ${method} not supported`);
    }
}
function isHttpMethod(method: string): method is HttpMethod {
    return ["GET", "POST", "PUT", "DELETE"].includes(method);
}


export { BreadRouter }