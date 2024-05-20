<script>
   import { createEventDispatcher, getContext } from "svelte";
   import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
   import Button from "$lib/components/ui/button/button.svelte";
   
   let deleteItem = getContext('deleteItem');
   const dispatch = createEventDispatcher();

   export let operation;
   
   function deleteOperation () {
      deleteItem(operation.context_id, operation.id);
      console.log(`Deleted operation ${ operation.id }`);
   }

   function addDescription () {
      operation.data.description = 'Operation description.';
   }

   function removeDescription () {
      delete operation.data.description;
      operation = operation;
   }

   function toggleOperation () {
      operation.data.enabled = !operation.data.enabled;
   }
</script>

<DropdownMenu.Root>
   <DropdownMenu.Trigger asChild let:builder>
      <Button builders={[builder]} variant="ghost" size="icon">
         <i class="ti ti-dots-vertical"></i>
      </Button>
   </DropdownMenu.Trigger>
   <DropdownMenu.Content class="w-56">
      {#if operation.data?.description}
         <DropdownMenu.Item class="text-red-600" on:click={removeDescription}>
            Remove description
         </DropdownMenu.Item>
      {:else}
         <DropdownMenu.Item on:click={addDescription}>
            Add description
         </DropdownMenu.Item>
      {/if}

      {#if operation.data.enabled}
         <DropdownMenu.Item on:click={toggleOperation}>
            Disable operation
         </DropdownMenu.Item>
      {:else}
         <DropdownMenu.Item on:click={toggleOperation}>
            Enable operation
         </DropdownMenu.Item>
      {/if}

      <DropdownMenu.Separator />

      <DropdownMenu.Item on:click={deleteOperation} class="text-red-600">
         Delete operation
      </DropdownMenu.Item>
   </DropdownMenu.Content>
</DropdownMenu.Root>
