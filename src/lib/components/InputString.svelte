<script>
   export let name;
   export let placeholder;
   export let inputValue;
   export let bindThis;
   export let isPassword;
</script>

<fieldset class="flex flex-col">
   <label class="text-lg">{ name }</label>
   {#if isPassword}
      <input class="input-md" bind:this={bindThis} bind:value={inputValue} type="text" name={name.toLowerCase()} placeholder={placeholder}>
   {:else}
      <input class="input-md" bind:this={bindThis} bind:value={inputValue} type="password" name={name.toLowerCase()} placeholder={placeholder}>
   {/if}
</fieldset>