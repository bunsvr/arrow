import { loadStyle } from "./utils";
import Minifier from "html-minifier";

function loadScript(script?: string) {
    return script ? /*html*/`<script async defer type="module" src="${script}"></script>` : "";
}

const opts: Minifier.Options = {
    "minifyCSS": true,
    "minifyJS": true,
    "removeComments": true,
    "collapseWhitespace": true,
    "collapseInlineTagWhitespace": true,
    "minifyURLs": true,
    "removeTagWhitespace": true,
    "collapseBooleanAttributes": true,
    "caseSensitive": true,
};

export interface Template {
    /**
     * Render root selector. Defaults to document body
     */
    root?: string,

    /**
     * Render the page with given stuff
     * @param props 
     */
    render(props: {script?: string, style?: string, head?: string}): string
}

export default {
    render(props: {script?: string, style?: string, head?: string}) {
        return Minifier.minify(/*html*/`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    ${props.style ?
                        /*html*/`<link ${loadStyle(props.style)}/>` 
                        : ""
                    }
                    <globals-loader />
                    <css-loader />
                    ${loadScript(props.script)}
                    ${props.head || ""}
                </head>
                <body></body>
            </html>
        `, opts);
    }
} as Template