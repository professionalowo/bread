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
    return async (c, next) => {
        const f = file(filePath);
        if (!await f.exists()) {
            return next();
        }
        return new Response(f, {
            headers: {
                "Content-Type": `${f.type}`,
            },
        });
    }
}
function handleStaticDir({ root }: { root: string }): MiddlewareHandler {
    const sanitizedRoot = sanitize(root);
    return async ({ request }, next) => {
        const { pathname } = new URL(request.url);
        const f = file(`${sanitizedRoot}${pathname}`);
        if (!await f.exists()) {
            return next();
        }
        return new Response(f, {
            headers: {
                "Content-Type": `${f.type}`,
            },
        });
    };
}


function sanitize(path: string): string {
    const sanitized = path;
    if (sanitized.endsWith("/")) {
        return sanitized.replace("/", "");
    }
    return sanitized;
}