/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="esnext" />
/// <reference types="../../global" />

import { ReactiveProxy, html, reactive } from "@arrow-js/core";

/**
 * Export a class
 */
export class App {
    /**
     * Use this as a state for the app
     */
    data: ReactiveProxy<{ password: string }>;

    /**
     * Set default state
     */
    constructor() {
        this.data = reactive({ password: "" });
    }

    /**
     * Render the app
     */
    render() {
        return html`
            <p>You are navigating on page: ${params.page}</p>
            <input type="password" @input="${e => 
                this.data.password = e.target.value
            }" />
            <p>Password: ${() => this.data.password}</p>
        `;
    }
}

// Set title
export const title = "Navigating";