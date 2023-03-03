import esbuild from "esbuild";
import { PageRouter as PRouter } from "@stricjs/pages";
import pathUtils from "path/posix";
import { stream } from "@stricjs/utils";
import template, { Template } from "./template";
import { existsSync } from "fs";
import { appendFile, mkdir, rm } from "fs/promises";
import { ArrowTemplate } from "@arrow-js/core";

async function clearDir(dir: string) {
    if (existsSync(dir))
        await rm(dir, { recursive: true });

    await mkdir(dir);
}

async function build(entries: string[], out: string, build: esbuild.BuildOptions) {
    return esbuild.build({
        minify: true,
        bundle: true,
        entryPoints: entries,
        entryNames: "[dir]/[name].[hash]",
        outdir: out,
        platform: "browser",
        format: "esm",
        metafile: true,
        ...build
    });
}

async function createFiles(routes: Route[], out: string, src: string, template: Template) {
    const paths = [];

    for (const route of routes) {
        const path = route.source.replace(src, out);
        paths.push(path);

        await appendFile(path, `
            import { render } from "${route.source}";
            const root = document.${template.root ? `querySelector(\`${template.root}\`)` : "body"};
            render()(root);
        `);

        route.source = path;
    }

    return paths;
}

type Route = {
    source: string,
    type: "static",
    path: string,
} | {
    source: string,
    type: "dynamic",
    path: string | RegExp,
};

export class PageRouter extends PRouter {
    private readonly routes: Route[];
    public readonly template: Template;

    constructor(private readonly build: esbuild.BuildOptions = {}) {
        super();

        this.routes = [];
        this.template = template;
    }
    static(path: string, source: string) {
        this.routes.push({
            path, type: "static",
            source: pathUtils.join(this.root, this.src, source)
        });

        return this;
    }
    dynamic(path: string | RegExp, source: string) {
        this.routes.push({
            path, type: "dynamic",
            source: pathUtils.join(this.root, this.src, source)
        });

        return this;
    }
    async load(streamOpts?: (BlobPropertyBag & ResponseInit) | undefined) {
        const outDir = pathUtils.join(this.root, this.out),
            srcDir = pathUtils.join(this.root, this.src);

        // Clean out dir before building again
        await clearDir(outDir);

        // Correct order of ESBuild output
        if (this.routes.length > 1)
            this.routes.sort((a, b) => {
                if (a.source < b.source)
                    return -1;
                else if (a.source > b.source)
                    return 1;
                return 0;
            });

        // Create files
        const files = await createFiles(this.routes, outDir, srcDir, this.template);

        // Build all files
        const metafile = await build(
            this.routes.map(v => v.source),
            outDir, this.build
        ).then(v => v.metafile) as esbuild.Metafile;

        // Delete uneccessary files
        await Promise.all(files.map(f => rm(f)));

        // Add routes
        {
            // All output files
            const keys = Object.keys(metafile.outputs).filter(e => e.endsWith(".js"));

            for (let i = 0; i < keys.length; ++i) {
                const route = this.routes[i],
                    sourceFile = keys[i];

                // Get head
                const head = await import(route.source.replace(outDir, srcDir))
                    .then(v => v?.head);

                // Get script
                const script = pathUtils.resolve(sourceFile).replace(outDir, "");

                // Get style
                const css = metafile.outputs[sourceFile].cssBundle,
                    style = css && pathUtils.resolve(css).replace(outDir, "");

                if (route.type === "static") {
                    const tmpl = template.render({ script, style, head });

                    this.router.static("GET", route.path, () => new Response(tmpl, {
                        headers: { "content-type": "text/html" }
                    }));
                } else
                    this.router.dynamic("GET", route.path, req =>
                        new Response(template.render({ script, style, params: req.params.groups, head }), {
                            headers: { "content-type": "text/html" }
                        })
                    );
            }
        }

        // Add middlewares and set development mode
        this.app.use(stream(outDir, streamOpts))
            .use(this.router.fetch())
            .development = this.dev;

        // Reset routes
        for (const route of this.routes)
            route.source = route.source.replace(outDir, srcDir);

        return this;
    }
}

// Types
export { Template };
export type RenderFunction = () => ArrowTemplate;