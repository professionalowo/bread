import type { ServeOptions } from "bun";
import { Bread } from "./src/bread";
import { serveStatic } from "./src/middlewares/serveStatic";




const bread = new Bread({ port: 3000 });
bread.use("/favicon.ico", serveStatic({ root: "./" }));

console.log(`Server running on http://localhost:${bread.port}`);
Bun.serve(bread);