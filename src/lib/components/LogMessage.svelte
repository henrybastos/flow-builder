<script>
    import { createEventDispatcher } from "svelte";

   export let data;
   let dispatch = createEventDispatcher();
   let httpRegex = 'https?:\/\/[^\\s]*';
   let wsRegex = 'wss?:\/\/[^\\s]*';
   let linkRegex = new RegExp(`(${ httpRegex }|${ wsRegex })`);

   function copyToClipboard (_text) {
      window.navigator.clipboard.writeText(_text);
      dispatch('clipboard_copy');
   }
</script>

<div class="font-code w-full">
   <span class="flex flex-nowrap text-neutral-600">
      <span>{ data.date } { data.time }</span>
      <span class={`tag_${ data.tag.type } mx-1`}>{ data.tag.label }</span>
      {#each data.message.split(linkRegex) as msg}
         {#if msg.match(linkRegex)}
            <span on:click={() => copyToClipboard(msg)} class="text-blue-400 hover:text-blue-500 whitespace-nowrap underline cursor-pointer">{ msg }</span>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <!-- <i  class="ti ti-clipboard hover:text-neutral-300 cursor-pointer ml-1"></i> -->
         {:else}
            <span class="text-neutral-200 whitespace-nowrap">{ msg }</span>
         {/if}
      {/each}
   </span>
</div>   

<style lang="postcss">
   .tag_success {
      @apply text-green-500;
  }

  .tag_info {
      @apply text-blue-500;
  }

  .tag_error {
      @apply text-red-600;
  }

  .tag_warning {
      @apply text-orange-500;
  }
</style>