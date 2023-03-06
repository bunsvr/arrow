import { html, reactive } from "@arrow-js/core";
import { Property } from "../..";
import "./styles/index.css";

// Code inside render function can directly use Web APIs 
// This function is run right after the DOM finished loading
export function render() {
    const click = reactive({ value: 0 });

    return html`
        <button @click="${() => ++click.value}">Click here!</button>
        <p>Click count: ${() => click.value}</p>
    `;
}

// Some page metadata
export const description: Property = "Made using ArrowJS";

/**
 * Property: 
 * `title`: (defaults to `Stric App`). Page title
 * `description`: Page description
 * `meta`: Additional meta properties
 * `charset`: (defaults to `UTF-8`). Can remove by set to `none`. Page charset
 * `viewport`: (defaults to `width=device-width,initial-scale=1`). Can remove by set to `none`. Page viewport
 */