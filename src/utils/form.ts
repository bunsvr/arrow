/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="esnext" />

import { DataSource, ReactiveProxy, reactive } from "@arrow-js/core";
import { Event } from "./types";

interface FormStates<T extends DataSource> {
    /**
     * Reactive data
     */
    readonly data: ReactiveProxy<T>;

    /**
     * Get input listener of an element from name
     * @param name 
     */
    input(name: string): (e: Event<HTMLInputElement>) => any;

    /**
     * Get select listener of a select element from name
     * @param name 
     */
    select(name: string): (e: Event<HTMLSelectElement>) => any;
}

/**
 * Create a form state handler
 * @param data 
 */
export function createForm<T extends DataSource>(data?: T): FormStates<T> & T {
    // @ts-ignore
    return new Proxy({
        // @ts-ignore
        data: reactive(data || {}),
        input(name) {
            return (e: Event<HTMLInputElement>) =>
                // @ts-ignore
                this.data[name] = e.target.value;
        },
        select(name) {
            return (e: Event<HTMLSelectElement>) =>
                // @ts-ignore
                this.data[name] = e.target.options[
                    e.target.selectedIndex
                ].value;
        }
    }, {
        get(t, p) {
            if (p !== "data" && p !== "input" && p !== "select")
                return t.data[p as string];
            return Reflect.get(t, p);
        }
    });
}