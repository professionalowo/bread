import type { Server } from "bun";
import { BreadHelpers } from "./breadHttpHelpers";

class BreadContext extends BreadHelpers {
    public params: Record<string, string> = {};
    public request: Request;
    constructor(request: Request, server?: Server) {
        super(server);
        this.request = request;
    }
}

export { BreadContext }