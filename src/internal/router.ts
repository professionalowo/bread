import { MiddlewarePathMapping, type MiddlewareHandler } from "./path/middlewarePathMapping";
import { type PathMappingHandler } from "./path/pathMapping";
import { RoutePathMapping, type RouteHandlerFunction } from "./path/routePathMapping";


class BreadRouter {
    protected middleware: MiddlewarePathMapping = new MiddlewarePathMapping();
    protected handlersGet: RoutePathMapping = new RoutePathMapping();
    protected handlersPost: RoutePathMapping = new RoutePathMapping();
    protected handlersPut: RoutePathMapping = new RoutePathMapping();
    protected handlersDelete: RoutePathMapping = new RoutePathMapping();

    public addMiddleware(path: string, handler: MiddlewareHandler | Array<MiddlewareHandler>): void {
        this.middleware.add(path, handler);
    }

    public addPut(path: string, handler: RouteHandlerFunction): void {
        this.handlersPut.add(path, handler);
    }

    public addDelete(path: string, handler: RouteHandlerFunction): void {
        this.handlersDelete.add(path, handler);
    }

    public addPost(path: string, handler: RouteHandlerFunction): void {
        this.handlersPost.add(path, handler);
    }

    public addGet(path: string, handler: RouteHandlerFunction): void {
        this.handlersGet.add(path, handler);
    }

    public async applyMiddlewares(request: Request): Promise<Response> {
        const handlers = this.middleware.getHandlers(new URL(request.url).pathname);
        return this.executeHandlers(request, handlers);
    }

    private async executeHandlers(request: Request, handlers: PathMappingHandler<MiddlewareHandler>[]): Promise<Response> {
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
                    return handler.middleware({ request: new Request(url, request), params: {} }, next);
                }
                return handler({ request, params: {} }, next);
            } else {
                // Default response if no middleware provides a response
                //TODO: Call route handlers here
                let handler: RouteHandlerFunction | undefined;
                switch (request.method) {
                    case "GET":
                        handler = this.handlersGet.getMostSpecificHandler(new URL(request.url).pathname)?.handler;
                        break;
                    case "POST":
                        handler = this.handlersPost.getMostSpecificHandler(new URL(request.url).pathname)?.handler;
                        break;
                    case "PUT":
                        handler = this.handlersPut.getMostSpecificHandler(new URL(request.url).pathname)?.handler;
                        break;
                    case "DELETE":
                        handler = this.handlersDelete.getMostSpecificHandler(new URL(request.url).pathname)?.handler;
                        break;
                }
                if (typeof handler === "function") {
                    return handler({ request, params: {} });
                }
                return new Response('Not Found', { status: 404 });
            }
        };

        return next();
    }
}

export { BreadRouter }