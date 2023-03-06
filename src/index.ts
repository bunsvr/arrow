import esbuild from "esbuild";
import { PageRouter as PRouter } from "@stricjs/pages";
import pathUtils from "path/posix";
import { stream } from "@stricjs/utils";
import template, { Template } from "./template";
import { existsSync } from "fs";
import { appendFile, mkdir, rm } from "fs/promises";
import { cssLoader, dynamicLoader, styleLoadScript, minify, paramsScript } from "./constants";
import { ArrowTemplate } from "@arrow-js/core";

/**
 * Render function type
 */
export type Render = () => ArrowTemplate;

/**
 * A property value type
 */
export type Property<T = string> = (() => T) | T;

/**
 * HTTP-Equiv value
 */
export type HttpEquiv = "content-security-policy" | "content-type" | "default-style" | "refresh";

/**
 * Meta value
 */
export interface MetaValue {
    charset?: string;
    httpEquiv?: HttpEquiv;
    content?: string;
}

/**
 * Meta value
 */
export type Meta = Property<Record<string, string | MetaValue>>;

// Options
const opts = {
    headers: {
        "content-type": "text/html"
    }
};

// Delete all files in a dir
async function clearDir(dir: string) {
    if (existsSync(dir))
        await rm(dir, { recursive: true });

    await mkdir(dir);
}

// Build script
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

// Create files to render stuff
async function createFiles(routes: Route[], out: string, src: string, template: Template) {
    const paths = [];

    for (const route of routes) {
        const path = route.source.replace(src, out);
        paths.push(path);

        // Support functional component and class component
        await appendFile(path, `
            import * as Page from "${route.source}";

            (Page.render ? Page.render() : new Page.App().render())(
                document.${template.root ? `querySelector(\`${template.root}\`)` : "body"}
            );
        `);

        route.source = path;
    }

    return paths;
}

// Route 
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
                let {
                    head = "",
                    title = "Stric App",
                    charset = "UTF-8",
                    viewport = "width=device-width,initial-scale=1",
                    description,
                    meta
                }: {
                    head: Property
                    title: Property,
                    charset: Property,
                    description: Property,
                    viewport: Property
                    meta: Meta
                } = await import(route.source.replace(outDir, srcDir)) || {};
                // Validate exports types
                {
                    // Check whether exports are callable
                    if (typeof head === "function")
                        head = await head();
                    if (typeof title === "function")
                        title = await title();
                    if (typeof description === "function")
                        description = await description();
                    if (typeof charset === "function")
                        charset = await charset();
                    if (typeof viewport === "function")
                        viewport = await viewport();
                    if (typeof meta === "function")
                        meta = await meta();

                    // Add title and charset if charset is not set to "none"
                    head += `
                        ${charset !== "none"
                            ? `<meta charset="${charset}" />` : ""}
                        ${viewport !== "none"
                            ? `<meta name="viewport" content="${viewport}" />` : ""}
                        <title>${title}</title>
                    `;
                    if (description)
                        head += `<meta name="description" content="${description}">`;
                    if (meta)
                        for (const key in meta) {
                            // If key contains only content
                            if (typeof meta[key] === "string")
                                meta[key] = {
                                    content: meta[key]
                                } as MetaValue;

                            // Add to head
                            const pageMeta = meta[key] as MetaValue;
                            head += `<meta 
                                name="${key}" 
                                ${pageMeta.charset ?
                                    `charset="${pageMeta.charset}"` : ""}
                                ${pageMeta.content ?
                                    `content="${pageMeta.content}"` : ""}
                                ${pageMeta.httpEquiv ?
                                    `http-equiv="${pageMeta.httpEquiv}"` : ""}
                            >`;
                        }
                }

                // Get script
                const script = pathUtils.resolve(sourceFile).replace(outDir, "");

                // Get style
                const css = metafile.outputs[sourceFile].cssBundle,
                    style = css && pathUtils.resolve(css).replace(outDir, "");

                // Check for route type
                if (route.type === "static") {
                    // Minify the loaded HTML
                    const tmpl = minify(
                        template.render({
                            script, style, head
                        })
                    )
                        .replace(dynamicLoader, "")
                        .replace(cssLoader, styleLoadScript);

                    this.router.static("GET", route.path, () =>
                        new Response(tmpl, opts));
                } else {
                    // Minify the loaded HTML
                    const tmpl = minify(
                        template.render({
                            script, style, head
                        })
                    ).replace(cssLoader, styleLoadScript);

                    this.router.dynamic("GET", route.path, req =>
                        new Response(
                            tmpl.replace(
                                dynamicLoader,
                                paramsScript(req.params)
                            ), opts
                        )
                    );
                }
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

// Types and utils
export * from "./constants";