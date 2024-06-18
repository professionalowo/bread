import { file } from "bun";
import type { MiddlewareHandler } from "../bread";
type ServeStaticOptions = { root: string };
export function serveStatic({ root }: ServeStaticOptions): MiddlewareHandler {
    return async (request) => {
        const { pathname } = new URL(request.url);
        return new Response(file(`${root}${pathname}`));
    };
}