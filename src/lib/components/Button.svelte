<script>
    export let text;
    export let className;
    // database-x
</script>

<button on:click class={`flex flex-row items-center ${className}`}>
    <slot name="l-icon"/>
    { text }
    <slot name="r-icon"/>
</button>