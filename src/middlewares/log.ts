import type { BreadContext } from "../bread";
import type { Next } from "../internal/path/middlewarePathMapping";

export function log({ request }: BreadContext, next: Next) {
    console.log(`-> ${request.method} ${new URL(request.url).pathname}`);
    return next();
}