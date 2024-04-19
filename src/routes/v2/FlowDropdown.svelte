<script>
   import { createEventDispatcher } from "svelte";
   import { FLOW_BUILDER_OPERATION_TEMPLATES as OPERATIONS_SCHEMA } from "$lib/OperationTemplates";
   import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
   import Button from "$lib/components/ui/button/button.svelte";
   import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

    
   export let flow;
    
   const dispatch = createEventDispatcher();
   const HIDDEN_OPERATIONS = [
      'set_payload_slot',
      'download_image',
      'eval_regex',
      'extract_param_from_url',
      'extract_route_from_url',
      'chrome_picker_set_color',
      'scrape_attr',
      'scrape_multiple_attr',
      'set_attr',
      'set_env',
   ]

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
      // console.log(operation, flow);
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

         flow = [
            ...flow,
            operationPayload
         ];

         console.log(flow);
         dispatch('new_operation');
      } catch (err) {
         console.error(err);
      }
   }

   function copyJSON () {
      console.log(JSON.stringify(flow, null, 3));
   }
</script>

<DropdownMenu.Root>
   <DropdownMenu.Trigger asChild let:builder>
      <Button builders={[builder]} variant="ghost" size="icon">
         <i class="ti ti-dots-vertical"></i>
      </Button>
   </DropdownMenu.Trigger>
   <DropdownMenu.Content class="w-56">
      <DropdownMenu.Group>
         <DropdownMenu.Item disabled>Rename</DropdownMenu.Item>
         <DropdownMenu.Item on:click={copyJSON}>Copy JSON</DropdownMenu.Item>

         <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Add operation</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
               <ScrollArea class="h-[20rem]" orientation="vertical">
                  {#each Object.entries(OPERATIONS) as [index, operation]}
                     {#if operation.category}
                        {#if index != 0}
                           <DropdownMenu.Separator />
                        {/if}
                        <DropdownMenu.Label>
                           <i class={`ti ti-${ operation.icon } text-lg text-blue-500 mr-1`}></i>
                           { operation.category }
                        </DropdownMenu.Label>
                        <DropdownMenu.Separator />
                     {/if}
   
                     {#each operation.ops as op}
                        <DropdownMenu.Item on:click={() => addOperation(op.value)}>{ op.label }</DropdownMenu.Item>
                     {/each}
                  {/each}
               </ScrollArea>
            </DropdownMenu.SubContent>
         </DropdownMenu.Sub>

      </DropdownMenu.Group>

      <DropdownMenu.Separator />

      <DropdownMenu.Item class="text-red-600">
         Delete flow
      </DropdownMenu.Item>
   </DropdownMenu.Content>
</DropdownMenu.Root>
