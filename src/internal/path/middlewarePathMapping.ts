import type { Bread, BreadContext } from "../../bread";
import { PathMapping, type PathMappingHandler } from "./pathMapping";
export type Next = {
    (): Promise<Response>
}

export type MiddlewareHandler = Bread | MiddlewareHandlerFunction;
type MiddlewareHandlerFunction = (c: BreadContext, next: Next) => Response | Promise<Response>

class MiddlewarePathMapping extends PathMapping<MiddlewareHandler> {
    public getHandlers(path: string): PathMappingHandler<MiddlewareHandler>[] {
        return this.handlers.filter(({ path: handlerPath }) => path.startsWith(handlerPath));
    }
}

export { MiddlewarePathMapping }