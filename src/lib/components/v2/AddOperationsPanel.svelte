<script>
   import { createEventDispatcher } from "svelte";
   import Button from '$lib/components/ui/button/button.svelte';
   import * as Dialog from '$lib/components/ui/dialog';
   import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
   import { FLOW_BUILDER_OPERATION_TEMPLATES as OPERATIONS_SCHEMA } from "$lib/OperationTemplates";

   export let isPanelOpen;
   export let flowID;
   export let flow;

   const dispatch = createEventDispatcher();

   const OPERATIONS = [
      {
         category: 'Control',
         icon: 'keyboard',
         ops: [      
            {
               icon: 'ti-hand-click',
               label: 'User click',
               value: 'user_click'
            },
            {
               icon: 'ti-pointer',
               label: 'Click',
               value: 'click'
            },
            {
               icon: 'ti-keyboard',
               label: 'Type',
               value: 'keyboard_type'
            },
            {
               icon: 'ti-command',
               label: 'Press key',
               value: 'press_key'
            },
         ]
      },
      {
         category: 'Flow',
         icon: 'arrow-fork',
         ops: [      
            {
               icon: 'ti-arrow-bear-right-2',
               label: 'Run flow',
               value: 'run_flow'
            },
            {
               icon: 'ti-zoom-scan',
               label: 'Run flow for each',
               value: 'run_flow_for_each'
            },
            {
               icon: 'ti-terminal',
               label: 'Branch eval',
               value: 'branch_eval'
            },
            {
               icon: 'ti-clock-search',
               label: 'Wait for selector',
               value: 'wait_for_selector'
            },
            {
               icon: 'ti-speedboat',
               label: 'Wait for navigation',
               value: 'wait_for_navigation'
            },
            {
               icon: 'ti-clock',
               label: 'Wait seconds',
               value: 'wait_seconds'
            },
            {
               icon: 'ti-folders',
               label: 'Wait for element',
               value: 'wait_for_element'
            },
            {
               icon: 'ti-zoom-scan',
               label: 'Check element',
               value: 'check_element'
            },
         ]
      },
      {
         category: 'Data',
         icon: 'binary',
         ops: [      
            {
               icon: 'ti-terminal-2',
               label: 'Eval expression',
               value: 'eval_expression'
            },
         ]
      },
      {
         category: 'Page',
         icon: 'browser',
         ops: [
            {
               icon: 'ti-send',
               label: 'Goto',
               value: 'goto'
            },
            {
               icon: 'ti-folder-plus',
               label: 'New page',
               value: 'new_page'
            },
            {
               icon: 'ti-folders',
               label: 'Select page',
               value: 'select_page'
            },
            {
               icon: 'ti-crane',
               label: 'Wait for DOM',
               value: 'wait_for_dom_render'
            },
            {
               icon: 'ti-box-margin',
               label: 'Attach to iFrame',
               value: 'attach_to_iframe'
            },
            {
               icon: 'ti-box-padding',
               label: 'Detach from iFrame',
               value: 'detach_from_iframe'
            },
            {
               icon: 'ti-refresh',
               label: 'Reload',
               value: 'reload'
            },
            {
               icon: 'ti-focus-centered',
               label: 'Screenshot',
               value: 'screenshot'
            },
            {
               icon: 'ti-clock',
               label: 'Close browser',
               value: 'close_browser'
            },
         ]
      }
   ]

   function addOperation (operation) {
      let operationPayload = {};
      
      try {
         const operationSchema = OPERATIONS_SCHEMA[operation];
         // console.log(operationSchema);

         operationPayload.command = operationSchema.command;
         operationPayload.enabled = true;

         if (OPERATIONS_SCHEMA[operation]?.input_fields) {
            for (let [field_name, field] of Object.entries(OPERATIONS_SCHEMA[operation].input_fields)) {
               operationPayload[field_name] = field.value;
            }
         }
         
         isPanelOpen = false;
         dispatch('newoperation', { operation: operationPayload });
      } catch (err) {
         console.error(err);
      }
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[36rem]">
      <Dialog.Header>
         <Dialog.Title class="text-2xl">Add operation</Dialog.Title>
      </Dialog.Header>

      <ScrollArea class="h-[30rem] px-4" orientation="vertical">
         {#each OPERATIONS as operation}
            <h2 class="text-xl capitalize py-4 border-t border-neutral-800">
               <i class={`ti ti-${ operation.icon } text-xl text-blue-500 mr-1`}></i>
               { operation.category }
            </h2>

            <div class="grid grid-cols-2 mb-4 gap-3">
               {#each operation.ops as op}
                  <Button on:click={() => addOperation(op.value)} variant="outline" class="w-full text-base">
                     {#if op.icon}
                     <i class={`ti ${ op.icon } text-blue-500 mr-1 text-xl`}></i>
                     {/if}
                     { op.label }
                  </Button>
               {/each}
            </div>
            <!-- <Separator /> -->
         {/each}
      </ScrollArea>
   </Dialog.Content>
</Dialog.Root>