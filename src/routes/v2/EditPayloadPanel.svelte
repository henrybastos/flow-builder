<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Button from "$lib/components/ui/button/button.svelte";
   import CodeMirrorModule from '$lib/modules/CodeMirrorModule/CodeMirrorModule.svelte';

   export let payload;
   export let isPanelOpen;

   let stringifiedPayload = JSON.stringify(payload, null, 3);

   function resetPayload () {
      stringifiedPayload = JSON.stringify(payload, null, 3);
   }

   function savePayload () {
      payload = JSON.parse(stringifiedPayload);
      isPanelOpen = false;
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[60rem]">
      <Dialog.Header class="h-min">
         <Dialog.Title class="text-xl">Output</Dialog.Title>
         <Dialog.Description class="text-base">The payload output.</Dialog.Description>
      </Dialog.Header>

      <div class="h-[30rem] overflow-y-auto">
         <CodeMirrorModule bind:value={stringifiedPayload}/>
      </div>

      <div class="flex flex-row-reverse gap-x-3">
         <Button variant="outline" on:click={resetPayload}>Reset</Button>
         <Button variant="default" on:click={savePayload}>Save</Button>
      </div>
   </Dialog.Content>
</Dialog.Root>