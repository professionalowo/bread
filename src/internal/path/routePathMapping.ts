import { PathMapping, type PathMappingHandler } from "./pathMapping";
export type RouteHandlerFunction = (request: Request) => Response | Promise<Response>


class RoutePathMapping extends PathMapping<RouteHandlerFunction> {
    public getMostSpecificHandler(path: string): PathMappingHandler<RouteHandlerFunction> | undefined {
        const handlers = this.handlers;
        return handlers[0];
    }
}

export { RoutePathMapping }