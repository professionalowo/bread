import type { Server } from "bun";
import { BreadHelpers } from "./breadHttpHelpers";

class BreadContext extends BreadHelpers {
    public params: Record<string, string> = {};
    public request: Request;
    public readonly server?: Server
    constructor(request: Request,server?: Server) {
        super();
        this.request = request;
        this.server = server;
    }
}

export { BreadContext }