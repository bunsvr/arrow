/// <reference types="../../global" />
import { html } from "@arrow-js/core";
import { ImageOptimizer } from "../../utils";
import tree from "./assets/image.png";

const img = new ImageOptimizer();

export function render() {
    return html`<img ${img.load()} 
        class="${ImageOptimizer.className}" 
        width="2560" height="1920" src="${tree}" 
    />`;
};

export function after() {
    ImageOptimizer.run();
}

export const head = ImageOptimizer.head;