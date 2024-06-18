import { Bread } from "./src/bread";
import { serveStatic } from "./src/middlewares/serveStatic";




const bread = new Bread({ port: 3000 });
bread.use("/favicon.ico", serveStatic({ root: "./" }));
bread.use("/", async (request, next) => {
    return new Response("Hello World");
});

console.log(`Server running on http://localhost:${bread.port}`);
Bun.serve(bread);