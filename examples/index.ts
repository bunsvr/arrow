import { PageRouter } from "..";
import { plugin } from "bun";

plugin({
    setup(builder) {
        builder.onLoad({ filter: /\.png$/ }, () => ({
            exports: { "default": "" },
            loader: "object"
        }));
    },
})

new PageRouter({
    loader: {
        ".png": "file"
    }
})
    .set("root", import.meta.dir)
    .static("/", "App.ts")
    .static("/form", "Form.ts")
    .static("/img", "Image.ts")
    .dynamic("/:page", "Page.ts")
    .serve();