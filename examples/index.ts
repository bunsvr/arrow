import { PageRouter } from "..";

new PageRouter()
    .set("root", import.meta.dir)
    .static("/", "App.ts")
    .dynamic("/:page", "Page.ts")
    .serve();