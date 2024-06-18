export type PathMappingHandler<THandler> = { path: string, handler: THandler };

class PathMapping<THandler> {
    protected handlers: PathMappingHandler<THandler>[] = [];

    public add(path: string, handler: THandler | THandler[]): void {

        if (handler instanceof Array) {
            this.handlers.push(...handler.map(handler => ({ path, handler })));
        }
        else {
            this.handlers.push({ path, handler });
        }
    }
}





export { PathMapping };