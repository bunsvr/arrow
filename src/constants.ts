export const globalsLoader = "<globals-loader>";
export const cssLoader = "<css-loader>";
export const styleLoadScript = /*html*/`<script async defer>for(let e of document.getElementsByClassName("__styles"))e.media="all"</script>`;

// Minified param script
export function paramsScript(arr: RegExpExecArray) {
    return `<script async>const params=\`${JSON.stringify(arr.groups)}\`;window.params=params</script>`;
}

// Options
export const opts = {
    headers: { 
        "content-type": "text/html"
    }
};
