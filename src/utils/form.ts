/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="esnext" />

import { DataSource, ReactiveProxy, reactive } from "@arrow-js/core";
import { Event } from "./types";

/**
 * State management for forms
 */
export class FormStates<T extends DataSource> {
    readonly data: ReactiveProxy<T>;

    /**
     * Create a form state management
     * @param data initial data
     */
    constructor(data?: T) {
        // @ts-ignore
        this.data = data || reactive<T>({});
    }

    /**
     * Get input listener of an input element from name
     * @param name 
     */
    input(name: string) {
        return (e: Event<HTMLInputElement>) =>
            // @ts-ignore
            this.data[name] = e.target.value;
    }

    /**
     * Get select listener of a select element from name
     * @param name 
     */
    select(name: string) {
        return (e: Event<HTMLSelectElement>) =>
            // @ts-ignore
            this.data[name] = e.target.options[
                e.target.selectedIndex
            ].value
    }
}