<script>
   import * as Popover from '$lib/components/ui/popover';
   import Button from '$lib/components/ui/button/button.svelte';   

   export let runCombinedPayload;
   export let isPayloadRunning;
   export let loadBlankPayload;
   export let savePayloadToLS;

   export let isStopExecutionPanelOpen;
   export let isLogsPanelOpen;
   export let isOutputPanelOpen;
   export let isEditPayloadPanelOpen;
   export let isAddFlowPanelOpen;
   export let isPresetsBrowserPanelOpen;
   export let isGenSchemaPanelOpen;

   const footerMessages = {
      genSchemaPanel: '[GenSchemaPanel]: Transforms the current payload to a Typescrypt file compatible with Flow Composer.',
      stopExecution: '[StopBrowser]: Stops the payload execution.',
      runCombinedPayload: '[RunMainFlow]: Executes the payload.',
      logs: '[Logs]: Opens the Logs panel.',
      output: '[Output]: Opens the Output panel.',
      editPayloadPanel: '[EditPayloadPanel]: Edits the payload.',
      addFlowPanel: '[AddFlowPanel]: Adds a new flow to the payload.'
   }

   let isHoverOpen = false;
</script>

<header class="fixed top-2 w-[60rem] h-fit bg-white bg-opacity-5 backdrop-blur-md rounded-lg">
   <div class="flex flex-row p-2 w-full justify-between">
      <div>
         {#if isPayloadRunning}
            <Button on:click={() => isStopExecutionPanelOpen = true} data-footer-message={footerMessages.stopExecution} variant="ghost">
               <i class="ti ti-player-stop text-red-500 mr-2"></i> Stop
            </Button>
         {:else}
            <Button on:click={runCombinedPayload} data-footer-message={footerMessages.runCombinedPayload} variant="ghost">
               <i class="ti ti-player-play-filled mr-2"></i> Run 
            </Button>
         {/if}
         
         <Button variant="ghost" data-footer-message={footerMessages.logs} on:click={() => isLogsPanelOpen = true}>
            <i class="ti ti-logs mr-2"></i> Logs
         </Button>

         <Button variant="ghost" data-footer-message={footerMessages.output} on:click={() => isOutputPanelOpen = true}>
            <i class="ti ti-toilet-paper mr-2"></i> Output
         </Button>

         <Button on:click={() => isEditPayloadPanelOpen = true} data-footer-message={footerMessages.editPayloadPanel} variant="ghost">
            <i class="ti ti-braces mr-2"></i> Payload
         </Button>

         <Button on:click={() => isAddFlowPanelOpen = true} data-footer-message={footerMessages.addFlowPanel} variant="ghost">
            <i class="ti ti-cube-plus mr-2"></i>Add flow
         </Button>
         
         <Button on:click={() => isGenSchemaPanelOpen = true} data-footer-message={footerMessages.genSchemaPanel} variant="ghost">
            <i class="ti ti-arrows-shuffle mr-2"></i>Gen Schema
         </Button>
      </div>
      
      <div>
         <Popover.Root bind:open={isHoverOpen}>
            <Popover.Trigger asChild let:builder>
               <Button builders={[builder]} variant="ghost" data-footer-message='[NewPayload]: Loads a new blank payload.'>
                  <i class="ti ti-list-details mr-2"></i> Presets
               </Button>
             </Popover.Trigger>
            <Popover.Content class="w-fit p-2" side="top-end" sideOffset={16}>
               <div class="flex flex-col">
                  <Button class="justify-start" variant="ghost" on:click={savePayloadToLS} data-footer-message='[LocalStorageSave]: Saves the current payload in the Local Storage, overwriting the previous payload.'>
                     <i class="ti ti-device-floppy mr-2"></i> Save temp preset
                  </Button>

                  <Button class="justify-start" variant="ghost" on:click={() => { isHoverOpen = false; isPresetsBrowserPanelOpen = true }} data-footer-message='[LocalStorageSave]: Saves the current payload in the Local Storage, overwriting the previous payload.'>
                     <i class="ti ti-list-search mr-2"></i> Preset Browser
                  </Button>
                  
                  <Button class="justify-start" variant="ghost" on:click={() => { isHoverOpen = false; loadBlankPayload() }} data-footer-message='[NewPayload]: Loads a new blank payload.'>
                     <i class="ti ti-file mr-2"></i> New blank preset
                  </Button>
             </div>
             </Popover.Content>
          </Popover.Root>
      </div>
   </div>
</header>