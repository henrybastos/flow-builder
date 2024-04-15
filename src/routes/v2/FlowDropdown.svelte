<script>
   import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
   import Button from "$lib/components/ui/button/button.svelte";

   const OPERATIONS = [
      {
         ops: [
            'wait_for_selector',
            'user_click',
            'click',
            'keyboard_type',
            'select_option',
            'set_attr',
            'set_env',
            'eval_regex',
            'reload',
            'press_key',
            'wait_for_navigation',
            'combo_keys',
            'wait_seconds',
            'set_payload_slot',
            'close_browser',
            'extract_param_from_url',
            'extract_route_from_url',
            'download_image',
            'detach_from_iframe',
            'attach_to_iframe',
            'chrome_picker_set_color',
            'wait_for_element',
            'check_element',
            'branch_eval',
            'screenshot'
         ]
      },
      {
         category: 'Data',
         ops: [      
            'scrape_attr',
            'scrape_multiple_attr',
            'goto',
            'eval_expression',
         ]
      },
      {
         category: 'Page',
         ops: [
            'wait_for_dom_render',
            'new_page',
            'select_page'
         ]
      }
   ]
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
         <DropdownMenu.Item>Copy JSON</DropdownMenu.Item>

         <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Add operation</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent class="max-h-40vh overflow-y-auto">
               {#each OPERATIONS as operationList}   
                  {#if operationList.category }
                     <DropdownMenu.Label>{ operationList.category }</DropdownMenu.Label>
                     <DropdownMenu.Separator />
                  {/if}
                  {#each operationList.ops as op}
                     <DropdownMenu.Item>{ op }</DropdownMenu.Item>
                  {/each}
               {/each}
            </DropdownMenu.SubContent>
         </DropdownMenu.Sub>

      </DropdownMenu.Group>

      <DropdownMenu.Separator />

      <DropdownMenu.Item class="text-red-600">
         Delete flow
      </DropdownMenu.Item>
   </DropdownMenu.Content>
</DropdownMenu.Root>
