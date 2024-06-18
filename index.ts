import type { ServeOptions } from "bun";



const port = 3000;
const fetch = function (request: Request) {
    return new Response("Hello, World!");
}
console.log(`Server running on http://localhost:3000`);
Bun.serve<ServeOptions>({ port, fetch })