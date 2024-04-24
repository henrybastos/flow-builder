<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Button from "$lib/components/ui/button/button.svelte";
   import hljs from 'highlight.js/lib/core';
   import hljs_theme from 'highlight.js/styles/tokyo-night-dark.min.css';
   import json from 'highlight.js/lib/languages/json';
   import { ServerHandler } from '$lib/ServerHandler';
   import { LOGGER, TAGS } from "$lib/LogStore";
    import Clipboard from "$lib/components/Clipboard.svelte";

   export let isPanelOpen;
   export let isPayloadRunning;
   export let toast;

   let responseTextareaEl;
   let outputCodeEl;

   ServerHandler.logger = LOGGER;
   ServerHandler.logger_tags = TAGS;

   hljs.registerLanguage('json', json);

   $: clipboardContent = JSON.stringify(JSON.parse(ServerHandler.responsePayload), null, 3);

   $: {
      if (isPanelOpen && !outputCodeEl?.dataset?.highlighted && outputCodeEl) {
         hljs.highlightElement(outputCodeEl);
      }
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[60rem]">
      <Dialog.Header class="h-min">
         <Dialog.Title class="text-xl">Output</Dialog.Title>
         <Dialog.Description class="text-base">The payload output.</Dialog.Description>
      </Dialog.Header>
      {#key isPayloadRunning}
         <pre class="h-[50vh] rounded-lg overflow-x-auto w-[57rem] font-code p-5 mt-2" 
            bind:this={outputCodeEl}
         >{ JSON.stringify(JSON.parse(ServerHandler.responsePayload), null ,3) }
         </pre>
      {/key}

      <div class="flex flex-row-reverse gap-x-2">
         <Clipboard let:copyToClipboard bind:clipboardContent={clipboardContent} {toast}>
            <Button variant="default" on:click={copyToClipboard}>
               Copy output
            </Button>
         </Clipboard>
      </div>
   </Dialog.Content>
</Dialog.Root>