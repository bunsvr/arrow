import { cssLoader, dynamicLoader, globalsLoader } from "./constants";
import { loadStyle, loadScript } from "./constants";

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
        return /*html*/`<!DOCTYPE html>
            <html lang="en">
                <head>
                    ${dynamicLoader}
                    ${globalsLoader}
                    ${loadScript(props.script)}
                    ${props.head || ""}
                    ${props.style ? `<link ${loadStyle(props.style)}/>` : ""}
                    ${cssLoader}
                </head>
                <body></body>
            </html>
        `;
    }
} as Template;