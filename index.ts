import type { ServeOptions } from "bun";
import { Bread } from "./src/bread";
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
bread.use("/", serveStatic({ root: "./public" }));

console.log(`Server running on http://localhost:${bread.port}`);
Bun.serve<ServeOptions>(bread);