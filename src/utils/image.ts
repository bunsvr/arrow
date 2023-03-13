const extReg = /[^.]+$/;
function ext(path: string) {
    return extReg.exec(path)?.[0] as string;
}

/**
 * Image loading option value
 */
export type Loading = "lazy" | "eager";

/**
 * Image decoding option value
 */
export type Decoding = "sync" | "async" | "auto";

/**
 * Provides a hint of the relative priority to use when fetching the image
 */
export type FetchPriority = "high" | "low" | "auto";

/**
 * Create optimized image
 */
export class ImageOptimizer {
    /**
     * Class name of images
     */
    static readonly className = "__images";

    /**
     * Loading type
     */
    loading: Loading = "lazy";

    /**
     * Decoding type
     */
    decoding: Decoding = "async";

    /**
     * Image alt
     */
    alt: string = "";

    /**
     * Provides a hint of the relative priority to use when fetching the image
     */
    priority: FetchPriority = "auto";

    /**
     * Create an image optimizer
     * @param props 
     */
    constructor(props: {
        loading?: Loading;
        decoding?: Decoding;
        alt?: string;
        priority?: FetchPriority;
    } = {}) {
        Object.assign(this, props);
    };

    /**
     * Get all the properties needed for images
     * @param inViewport 
     * @returns 
     */
    load(inViewport: boolean = false) {
        return `
            loading="${inViewport ? "eager" : this.loading}" 
            decoding="${this.decoding}"
            alt="${this.alt}"
            priority="${this.priority}"
        `;
    }

    /**
     * Needed css to add to head
     */
    static readonly head = `<style>.${this.className} {
        content-visibility: auto;
        background-size: cover;
        background-image: 
            url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http%3A//www.w3.org/2000/svg'
            xmlns%3Axlink='http%3A//www.w3.org/1999/xlink' viewBox='0 0 1280 853'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='.5'%3E%3C/feGaussianBlur%3E%3CfeComponentTransfer%3E%3CfeFuncA type='discrete' tableValues='1 1'%3E%3C/feFuncA%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Cimage filter='url(%23b)' x='0' y='0' height='100%25' width='100%25' 
            xlink%3Ahref='data%3Aimage/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAGCAIAAACepSOSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAs0lEQVQI1wGoAFf/AImSoJSer5yjs52ktp2luJuluKOpuJefsoCNowB+kKaOm66grL+krsCnsMGrt8m1u8mzt8OVoLIAhJqzjZ2tnLLLnLHJp7fNmpyjqbPCqLrRjqO7AIeUn5ultaWtt56msaSnroZyY4mBgLq7wY6TmwCRfk2Pf1uzm2WulV+xmV6rmGyQfFm3nWSBcEIAfm46jX1FkH5Djn5AmodGo49MopBLlIRBfG8yj/dfjF5frTUAAAAASUVORK5CYII='%3E%3C/image%3E%3C/svg%3E");
    }</style>`;

    /**
     * Optimize script for images
     */
    static run() {
        for (const item of document.getElementsByClassName(this.className))
            (item as HTMLElement).style.backgroundImage = "none";
    }
};

