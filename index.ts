import { Bread, type BreadContext } from "./src/bread";
import type { Next } from "./src/internal/path/middlewarePathMapping";
import { log } from "./src/middlewares/log";
import { serveStatic } from "./src/middlewares/serveStatic";

const posts = new Bread();
posts.get("/", async (c) => {
    return new Response("Posts");
});
const api = new Bread();
api.use("/posts", posts);
api.get("/", async (c) => {
    return c.json({ message: "API" });
});

const bread = new Bread({ port: 3000 });
bread.use("/", log);
bread.use("/api", api);
bread.use("/", serveStatic({ file: "./public/index.html" }));

console.log(`Server running on http://localhost:${bread.port}`);
Bun.serve(bread);