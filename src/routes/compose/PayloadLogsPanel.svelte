<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import LogMessage from "$lib/components/LogMessage.svelte";
   import { LOGGER } from "$lib/LogStore";
   
   export let errorMessages = [];
   
   export let isPanelOpen = false;
   export let isPayloadRunning;
   export let toast;

   $: {
      errorMessages = Object.values($LOGGER.messages).filter(msg => msg.tag.label === '[ERROR]');
      if (!isPayloadRunning && errorMessages.length > 0) {
         toast.error('Ocorreu um erro durante a execução dos blocos.');
         errorMessages = [];
      }
   };
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[90vw]">
       <Dialog.Header>
           <Dialog.Title class="text-xl">Logs</Dialog.Title>
           <Dialog.Description>Shows the logs of the payload execution.</Dialog.Description>
       </Dialog.Header>

       <div class="console_screen flex-col-reverse overflow-y-auto overflow-x-clip max-h-[36rem] border">
           {#each Object.entries($LOGGER.messages).reverse() as [msg_key, msg], _ (msg_key)}
               <!-- <span class="flex flex-row p-3 bg-blue-500">{ msg.time } • { msg.tag.label } { msg.message }</span> -->
               <LogMessage data={msg} />
           {/each}

       </div>

       {#if isPayloadRunning}
           <p class="font-code font-semibold text-neutral-500"><i class="inline-flex w-fit h-fit ti ti-loader-2 animate-spin mr-1"></i> Processing operations...</p>
       {:else}
           <p class="font-code font-semibold text-neutral-500">All operations processed.</p>
       {/if}
   </Dialog.Content>
</Dialog.Root>
