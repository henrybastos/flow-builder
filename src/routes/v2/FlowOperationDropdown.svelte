<script>
   import { createEventDispatcher, getContext } from "svelte";
   import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
   import Button from "$lib/components/ui/button/button.svelte";
   
   let list = getContext('list');
   const dispatch = createEventDispatcher();

   export let operation;
   
   function deleteOperation () {
      let thisList = $list.find(list => list.context_id === operation.context_id).list
      thisList = thisList.filter(op => op.id !== operation.id);
      $list.find(list => list.context_id === operation.context_id).list = thisList;
      
      console.log(`Deleted operation ${ operation.id }`);
      $list = $list;
   }

   function addDescription () {
      operation.data.description = 'Operation description.';
   }
</script>

<DropdownMenu.Root>
   <DropdownMenu.Trigger asChild let:builder>
      <Button builders={[builder]} variant="ghost" size="icon">
         <i class="ti ti-dots-vertical"></i>
      </Button>
   </DropdownMenu.Trigger>
   <DropdownMenu.Content class="w-56">
      <DropdownMenu.Item on:click={addDescription}>
         Add description
      </DropdownMenu.Item>

      <DropdownMenu.Item on:click={deleteOperation} class="text-red-600">
         Delete operation
      </DropdownMenu.Item>
   </DropdownMenu.Content>
</DropdownMenu.Root>
