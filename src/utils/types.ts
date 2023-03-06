export interface Event<T extends HTMLElement> extends globalThis.Event {
    readonly target: EventTarget & T;
    readonly currentTarget: EventTarget & T;
}