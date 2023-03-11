import { ArrowTemplate } from "@arrow-js/core";

/**
 * Base component
 */
export abstract class Component<Arguments extends any[] = any[]> {
    /**
     * Passed arguments
     */
    readonly args: Arguments;

    /**
     * Create a component instance
     * @param args 
     */
    constructor(...args: Arguments) {
        this.args = args;
    }

    /**
     * Render the app
     */
    abstract render(): ArrowTemplate | Promise<ArrowTemplate>;

    /**
     * Render the current class component
     * @param args the arguments
     */
    static render<Arguments extends any[] = any[]>(
        ...args: Arguments
    ) {
        // @ts-ignore
        return new this(...args).render();
    }
}