import type { Server } from "bun";

export class BreadHelpers {
    private readonly server: Server | undefined;
    constructor(server?: Server) {
        this.server = server;
    }

    public json<T extends {}>(arg: T, init?: ResponseInit | undefined): Response {
        return new Response(JSON.stringify(arg),
            {
                ...init,
                headers: { "Content-Type": "application/json" }
            });
    }

    public text(arg: string, init?: ResponseInit | undefined): Response {
        return new Response(arg,
            {
                ...init,
                headers: { "Content-Type": "text/plain" }
            });
    }

    public html(arg: string, init?: ResponseInit | undefined): Response {
        return new Response(arg,
            {
                ...init,
                headers: { "Content-Type": "text/html" }
            });
    }

    public upgrade(req: Request) {
        return this.server?.upgrade(req) ?? false;
    }
}