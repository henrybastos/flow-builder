<script>
    export let inputName, inputValueHandler, inputLabel, inputPlaceholder, rows;
</script>

<div class="labeled-input ">
    {#if inputLabel}
        <label for={ inputName }>{ inputLabel }</label>
    {/if}
    <textarea class="resize-none" rows={rows} on:change bind:value={inputValueHandler} type="text" name={ inputName } placeholder={ inputPlaceholder }></textarea>
</div>