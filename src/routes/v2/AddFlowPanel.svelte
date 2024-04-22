<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import { convertToSnakeCase } from "$lib/utils";
   import Input from "$lib/components/ui/input/input.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
    import { createEventDispatcher } from "svelte";

   export let isPanelOpen = false;
   
   let newFlowName;
   let dispatch = createEventDispatcher();

   function addFlow () {
      newFlowName = convertToSnakeCase(newFlowName);
      dispatch('addflow', { flowName: newFlowName });
      isPanelOpen = false;
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content>
      <Dialog.Header>
         <Dialog.Title>Add flow</Dialog.Title>
         <Dialog.Description>Adds a new flow to the payload.</Dialog.Description>
      </Dialog.Header>

      <Input on:change={({ target }) => newFlowName = target.value} type="text"/>
      <div class="grid grid-cols-2 gap-x-3">
         <Button variant="primary" on:click={addFlow}>Add</Button>
         <Button variant="outline" on:click={() => isPanelOpen = false}>Cancel</Button>
      </div>
   </Dialog.Content>
</Dialog.Root>