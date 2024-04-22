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
               label: 'User click',
               value: 'user_click'
            },
            {
               label: 'Click',
               value: 'click'
            },
            {
               label: 'Type',
               value: 'keyboard_type'
            },
            {
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
               label: 'Run flow',
               value: 'run_flow'
            },
            {
               label: 'Run flow for each',
               value: 'run_flow_for_each'
            },
            {
               label: 'Branch eval',
               value: 'branch_eval'
            },
            {
               label: 'Wait for selector',
               value: 'wait_for_selector'
            },
            {
               label: 'Wait for navigation',
               value: 'wait_for_navigation'
            },
            {
               label: 'Wait seconds',
               value: 'wait_seconds'
            },
            {
               label: 'Wait for element',
               value: 'wait_for_element'
            },
            {
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
               label: 'Goto',
               value: 'goto'
            },
            {
               label: 'New page',
               value: 'new_page'
            },
            {
               label: 'Select page',
               value: 'select_page'
            },
            {
               label: 'Wait for DOM render',
               value: 'wait_for_dom_render'
            },
            {
               label: 'Attach to iFrame',
               value: 'attach_to_iframe'
            },
            {
               label: 'Detach from iFrame',
               value: 'detach_from_iframe'
            },
            {
               label: 'Reload',
               value: 'reload'
            },
            {
               label: 'Screenshot',
               value: 'screenshot'
            },
            {
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
         console.log(operationSchema);

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

            <div class="space-y-2 mb-4">
               {#each operation.ops as op}
                  <Button on:click={() => addOperation(op.value)} variant="ghost" class="w-full text-base">{ op.label }</Button>
               {/each}
            </div>
            <!-- <Separator /> -->
         {/each}
      </ScrollArea>
   </Dialog.Content>
</Dialog.Root>