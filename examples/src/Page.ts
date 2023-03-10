/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="esnext" />
/// <reference types="../../global" />

import { html } from "@arrow-js/core";

export class App {
    // Render the app
    render() {
        return html`<p>${props.hello} You are navigating on page: <code>${params.page}</code></p>`;
    }
}

// Run on build and load props to client
export function load() {
    return { hello: "Welcome!"};
}

// Set title
export const title = "Navigating";