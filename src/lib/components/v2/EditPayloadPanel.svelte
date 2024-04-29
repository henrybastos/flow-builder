<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Button from "$lib/components/ui/button/button.svelte";
   import CodeMirrorModule from '$lib/modules/CodeMirrorModule/CodeMirrorModule.svelte';
   import { fade } from "svelte/transition";
    import { createEventDispatcher } from "svelte";

   export let payload;
   export let isPanelOpen;

   const dispatch = createEventDispatcher();
   let stringifiedPayload;
   let canClose = true;
   let footerCaption = {
      message: '',
      type: ''
   };

   $: {
      // Only updates if the payload has changes and the user can already close the panel (all changes had been applied)
      if (isPanelOpen && canClose) {
         stringifiedPayload = JSON.stringify(payload, null, 3);
      }
   };

   function resetPayload () {
      stringifiedPayload = JSON.stringify(payload, null, 3);
      canClose = true;
      isPanelOpen = false;
   }

   function savePayload () {
      try {
         if (JSON.parse(stringifiedPayload)) {
            canClose = true;
            const newPayload = JSON.parse(stringifiedPayload);
            footerCaption.message = '';
            footerCaption.type = '';
            // console.log(JSON.stringify(payload, null, 3));
            // console.log(stringifiedPayload);
            isPanelOpen = false;
            dispatch('updatepayload', { payload: newPayload });
         }
      } catch (err) {
         footerCaption.message = 'Invalid JSON payload';
         footerCaption.type = 'error';
      }
   }

   function registerChange () {
      footerCaption.message = 'Unsaved changes';
      footerCaption.type = 'warning';
      canClose = false;
   }
</script>

<Dialog.Root bind:closeOnOutsideClick={canClose} bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[60rem]">
      <Dialog.Header class="h-min">
         <Dialog.Title class="text-xl">Output</Dialog.Title>
         <Dialog.Description class="text-base">The payload output.</Dialog.Description>
      </Dialog.Header>

      <div class="h-[30rem] overflow-y-auto">
         <CodeMirrorModule on:change={registerChange} bind:value={stringifiedPayload}/>
      </div>

      <Dialog.Footer>
         <div class="flex flex-row-reverse items-center gap-x-3 w-full">
            <Button variant="outline" on:click={resetPayload}>Cancel</Button>
            <Button variant="default" on:click={savePayload} class="relative">
               {#if !canClose}    
                     <span class="absolute flex h-3 w-3 -top-1 -right-1">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                     </span>
               {/if}
               Save
            </Button>

            {#if footerCaption.message}
               {#if footerCaption.type === 'warning'}
                  <p transition:fade={{ duration: 100 }} class="text-orange-500 w-full text-left transition-all">{ footerCaption.message }</p>
               {:else if footerCaption.type === 'error'}
                  <p transition:fade={{ duration: 100 }} class="text-red-500 w-full text-left transition-all">{ footerCaption.message }</p>
               {/if}
            {/if}
         </div>
      </Dialog.Footer>
   </Dialog.Content>
</Dialog.Root>