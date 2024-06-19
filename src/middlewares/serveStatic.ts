import { file } from "bun";
import type { MiddlewareHandler } from "../bread";
type ServeStaticOptions = { root: string } | { file: string };
export function serveStatic(props: ServeStaticOptions): MiddlewareHandler {
    if ("root" in props) {
        return handleStaticDir(props);
    }
    return handleStaticFile(props);
}

function handleStaticFile({ file: filePath }: { file: string }): MiddlewareHandler {
    return async (c) => {
        return new Response(file(filePath));
    }
}
function handleStaticDir({ root }: { root: string }): MiddlewareHandler {
    const sanitizedRoot = sanitize(root);
    return async ({ request }) => {
        const { pathname } = new URL(request.url);
        return new Response(file(`${sanitizedRoot}${pathname}`));
    };
}


function sanitize(path: string): string {
    const sanitized = path;
    if (sanitized.endsWith("/")) {
        return sanitized.replace("/", "");
    }
    return sanitized;
}