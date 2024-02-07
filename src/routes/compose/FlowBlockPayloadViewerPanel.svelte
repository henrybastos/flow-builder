<script>
   import * as Dialog from "$lib/components/ui/dialog";

   export let flowBlock;
   export let isPanelOpen = false;
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[60rem]">
       <Dialog.Header>
           <Dialog.Title class="text-xl">
               { flowBlock.title }
               {#if flowBlock.block_id}
                   <span class="text-neutral-500 font-code text-base pl-2">{ flowBlock.block_id }</span>
               {/if}
           </Dialog.Title>
           <Dialog.Description>{ flowBlock.description }</Dialog.Description>
       </Dialog.Header>

       <pre class="max-h-[80vh] overflow-y-auto border border-neutral-700 rounded-lg p-4 font-code">{ JSON.stringify(flowBlock.payload, null, 3) }</pre>
   </Dialog.Content>
</Dialog.Root>