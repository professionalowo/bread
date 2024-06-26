import type { Server } from "bun";

export class BreadHelpers {
    private readonly server: Server | undefined;
    constructor(server?: Server) {
        this.server = server;
    }

    public json<T extends {}>(arg: T, init?: ResponseInit): Response {
        return new Response(JSON.stringify(arg),
            {
                ...init,
                headers: { "Content-Type": "application/json" }
            });
    }

    public text(...args: ConstructorParameters<typeof Response>): Response {
        const [arg, init] = args;
        return new Response(arg,
            {
                ...init,
                headers: { "Content-Type": "text/plain" }
            });
    }

    public html(...args: ConstructorParameters<typeof Response>): Response {
        const [arg, init] = args;
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