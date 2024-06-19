export class BreadHelpers {
    public json(arg: unknown, init?: ResponseInit | undefined): Response {
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
}