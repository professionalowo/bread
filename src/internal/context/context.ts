import { BreadHelpers } from "./breadHttpHelpers";

class BreadContext extends BreadHelpers {
    public params: Record<string, string> = {};
    public request: Request;
    constructor(request: Request) {
        super();
        this.request = request;
    }
}

export { BreadContext }