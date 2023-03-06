import { Options, minify as mini } from "html-minifier";

export const dynamicLoader = "<dynamic-loader>";
export const cssLoader = "<css-loader>";
export const styleLoadScript = /*html*/`<script async defer>for(let e of document.getElementsByClassName("__styles"))e.media="all"</script>`;

/**
 * Load stylesheets asynchronously
 * @param href 
 */
export function loadStyle(href: string) { 
    return `media="print" class="__styles" rel="stylesheet" href="${href}"`; 
};

/**
 * Load script asynchronously and run when finish loading DOM
 * @param script 
 */
export function loadScript(script?: string) {
    return script ? /*html*/`<script async defer type="module" src="${script}"></script>` : "";
}

const opts: Options = {
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

/**
 * Minify HTML with default options
 * @param html 
 */
export function minify(html: string) {
    return mini(html, opts);
}

// Minified param script
export function paramsScript(arr: RegExpExecArray) {
    return `<script async>const params=${JSON.stringify(arr.groups)};window.params=params</script>`;
}