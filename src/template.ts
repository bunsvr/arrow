import { loadStyle } from "./utils";

function loadScript(props: {params?: string, script?: string}) {
    return (props.params ? /*html*/`<script async>window.params = ${props.params}</script>` : "")
        + (props.script ? /*html*/`<script async defer type="module" src="${props.script}"></script>` : "");
}

function loadStyles(style?: string) {
    return (style ?/*html*/`<link ${loadStyle(style)}/>` : "")
        + /*html*/`
            <script async defer>
                for (let e of document.getElementsByClassName("__styles"))
                    e.media="all"
            </script>
        `;
}

export interface Template {
    /**
     * Render root selector. Defaults to document body
     */
    root?: string,

    /**
     * Render the page with given stuff
     * @param props 
     */
    render(props: {script?: string, style?: string, params?: Record<string, string>, head?: string}): string
}

export default {
    render(props: {script?: string, style?: string, params?: Record<string, string>, head?: string}) {
        props.head ||= "";
        const params = props.params && JSON.stringify(props.params); 
    
        return /*html*/`<!DOCTYPE html>
            <html lang="en">
                <head>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    ${loadStyles(props.style)}
                    ${loadScript({ params, script: props.script })}
                    ${props.head || ""}
                </head>
                <body></body>
            </html>
        `;
    }
} as Template