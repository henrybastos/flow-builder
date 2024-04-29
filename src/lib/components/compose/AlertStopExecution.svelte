<script>
   import * as AlertDialog from "$lib/components/ui/alert-dialog";
   import Button from "$lib/components/ui/button/button.svelte";

   export let isPanelOpen;
   export let stopAction;
</script>

<AlertDialog.Root bind:open={isPanelOpen}>
   <AlertDialog.Content>
      <AlertDialog.Header>
         <AlertDialog.Title
            >Você gostaria mesmo de interromper a execução?</AlertDialog.Title
         >
         <AlertDialog.Description class="text-base"
            >Todas as operações já executadas não serão revertidas, podendo
            deixar efeitos colaterais.</AlertDialog.Description
         >
      </AlertDialog.Header>

      <AlertDialog.Footer>
         <AlertDialog.Cancel asChild let:builder>
            <Button
               variant="destructive"
               builders={[builder]}
               on:click={stopAction}
               >Interromper execução</Button
            >
         </AlertDialog.Cancel>
         <AlertDialog.Action>Continuar a execução</AlertDialog.Action>
      </AlertDialog.Footer>
   </AlertDialog.Content>
</AlertDialog.Root>