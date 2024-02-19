<script>
    import hljs from 'highlight.js/lib/core';
    import json from 'highlight.js/lib/languages/json'
    import theme from 'highlight.js/styles/base16/material-vivid.css';
    import { onMount } from 'svelte';

    let code_area;

    onMount(() => {
        // code_area.innerHTML = hljs.highlight(
        //     JSON.stringify({ name: 'Henry' }, null, 3),
        //     { language: 'json' }
        // ).value;

        hljs.registerLanguage('json', json);
        hljs.highlightElement(code_area);
    })
</script>

<pre><code style={theme} bind:this={code_area}>{ JSON.stringify({ name: 'Henry', hljs: 'https://highlightjs.org/demo' }, null, 3) }</code></pre>