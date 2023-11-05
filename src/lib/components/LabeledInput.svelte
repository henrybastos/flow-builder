<script>
    export let inputName, inputValueHandler, inputLabel, inputPlaceholder;
</script>

<div class="labeled-input">
    {#if inputLabel}
        <label for={ inputName }>{ inputLabel }</label>
    {/if}
    <input on:change bind:value={inputValueHandler} type="text" name={ inputName } placeholder={ inputPlaceholder }>
</div>