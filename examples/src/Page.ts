/// <reference types="../../global" />
import { html } from "@arrow-js/core";

export class App {
    // Render the app
    render() {
        return html`<p>
            ${props.hello} You are navigating on page: <code>${params.page}</code><br />
            Current pathname: <code>${props.path}</code>
        </p>`;
    }
}

// Run on every request and load props to client
export function load(req: Request) {
    // Do some server-side stuff here 
    return { 
        hello: "Welcome!", 
        path: req.path 
    };
}

// Set title
export const title = "Navigating";