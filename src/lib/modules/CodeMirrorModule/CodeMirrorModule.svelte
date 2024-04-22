<script>
    import CodeMirror from "svelte-codemirror-editor";
    import { json } from "@codemirror/lang-json";
    import { onMount } from "svelte";
    export let value;

    const codeMirrorStyle = {
        "&": {
            color: "#fafafa",
            backgroundColor: "#171717"
        },
        ".cm-content": {
            caretColor: "#334155",
            fontFamily: "JetBrains Mono"
        },
        "&.cm-focused .cm-cursor": {
            borderColor: "#3b82f6",
            borderWidth: "1px"
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "#FFF"
        },
        ".cm-line span": {
            color: "#3b82f6"
        },
        ".cm-gutters": {
            fontFamily: "JetBrains Mono",
            backgroundColor: "#262626",
            color: "#737373",
            border: "none"
        }
    }
</script>

<CodeMirror on:change bind:value={value} styles={codeMirrorStyle} lang={json()} />