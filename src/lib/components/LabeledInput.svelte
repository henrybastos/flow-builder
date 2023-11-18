<script>
    export let inputName
    export let inputValueHandler
    export let inputLabel
    export let inputPlaceholder;
</script>

<div class="labeled-input">
    {#if inputLabel}
        <label for={ inputName }>{ inputLabel }</label>
    {/if}
    <input on:change bind:value={inputValueHandler} type="text" name={ inputName } placeholder={ inputPlaceholder }>
</div>