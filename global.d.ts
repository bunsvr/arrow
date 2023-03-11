interface Request<T = any> {
    /**
     * Parsed URL parameters. Only usable with RegExp routes.
     */
    readonly params: Parameters;
    /**
     * Request pathname
     */
    readonly path: string;
    /**
     * Data object to store some vars through middlewares
     */
    data?: T;
}

interface Window {
    /**
     * Parsed parameter
     */
    readonly params: Record<string, string>;
    /**
     * Server-side props
     */
    readonly props: any;
}
/**
 * Parsed parameter
 */
declare const params: Record<string, string>;

/**
 * Server-side props
 */
declare const props: any;

// Enable searching for files
declare module "*.css" { }

declare module "*.avif" {
    const src: string;
    export default src;
}

declare module "*.bmp" {
    const src: string;
    export default src;
}

declare module "*.gif" {
    const src: string;
    export default src;
}

declare module "*.jpg" {
    const src: string;
    export default src;
}

declare module "*.jpeg" {
    const src: string;
    export default src;
}

declare module "*.png" {
    const src: string;
    export default src;
}

declare module "*.webp" {
    const src: string;
    export default src;
}

declare module "*.svg" {
    const src: string;
    export default src;
}
declare module "*.module.css" {
    const classes: Readonly<Record<string, string>>;
    export default classes;
}

declare module "*.module.scss" {
    const classes: Readonly<Record<string, string>>;
    export default classes;
}

declare module "*.module.sass" {
    const classes: Readonly<Record<string, string>>;
    export default classes;
}
