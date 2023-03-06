import { html } from "@arrow-js/core";
import { Event, FormStates } from "../../utils";

// Form state management
const form = new FormStates<{
    name: string,
    pass: string
}>();

// Log the stuff
function submit(e: Event<HTMLInputElement>) {
    e.preventDefault();

    console.log("Username:", form.data.name);
    console.log("Password:", form.data.pass);
}

/**
 * Render a form
 */
export function render() {
    return html`
        <form @submit="${submit}">
            <input @input="${form.input("name")}" />
            <input @input="${form.input("pass")}" />
            <input type="submit" />
        </form>
    `;
}

// Some metadata
export const title = "Form example";
export const description = "Made using ArrowJS";