/**
 * Load stylesheets asynchronously
 * @param href 
 */
export function loadStyle(href: string) { 
    return `media="print" class="__styles" rel="stylesheet" href="${href}"`; 
};