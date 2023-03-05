import { cssLoader, dynamicLoader } from "./constants";
import { loadStyle, loadScript } from "./utils";

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
                    ${props.style ? `<link ${loadStyle(props.style)}/>` : ""}
                    ${dynamicLoader}
                    ${cssLoader}
                    ${loadScript(props.script)}
                    ${props.head || ""}
                </head>
                <body></body>
            </html>
        `;
    }
} as Template