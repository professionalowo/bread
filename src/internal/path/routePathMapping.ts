import type { BreadContext } from "../../bread";
import { PathMapping, type PathMappingHandler } from "./pathMapping";
export type RouteHandlerFunction = (c: BreadContext) => Response | Promise<Response>


class RoutePathMapping extends PathMapping<RouteHandlerFunction> {
    public getMostSpecificHandler(path: string): PathMappingHandler<RouteHandlerFunction> | undefined {
        const handlers = this.handlers;
        return handlers[0];
    }
}

export { RoutePathMapping }