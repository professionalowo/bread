import { Bread } from "./src/bread";
import type { Next } from "./src/internal/path/middlewarePathMapping";
import { serveStatic } from "./src/middlewares/serveStatic";

function log(request: Request, next: Next) {
    console.log(`-> ${request.method} ${new URL(request.url).pathname}`);
    return next();
}

const posts = new Bread();
posts.get("/", async (request) => {
    return new Response("Posts");
});
const api = new Bread();
api.use("/posts", posts);
api.get("/", async (request) => {
    return new Response("API");
});

const bread = new Bread({ port: 3000 });
bread.use("/", log);
bread.use("/api", api);
bread.use("/favicon.ico", serveStatic({ root: "./" }));
bread.get("/", async (request) => {
    return new Response("Hello World");
});

console.log(`Server running on http://localhost:${bread.port}`);
Bun.serve(bread);