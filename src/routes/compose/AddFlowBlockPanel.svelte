<script>
   import * as Dialog from "$lib/components/ui/dialog";

   export let isPanelOpen = false;
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[60rem]">
       <Dialog.Header>
           <Dialog.Title class="text-xl">Adicionar bloco</Dialog.Title>
           <!-- <Dialog.Description>{ flowBlock.description }</Dialog.Description> -->
       </Dialog.Header>

   </Dialog.Content>
</Dialog.Root>