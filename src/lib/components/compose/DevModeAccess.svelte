<script>
  import * as Dialog from "$lib/components/ui/dialog";
  import Button from "$lib/components/ui/button/button.svelte";

  export let isPanelOpen = false;

  function enableDevMode () {
    window.location.href = 'http://localhost:5173/compose?dev_mode';
  }
</script>

<Dialog.Root bind:open={isPanelOpen}>
  <Dialog.Content class="max-w-[60rem]">
      <Dialog.Header>
          <Dialog.Title class="text-xl">Access Dev Mode</Dialog.Title>
          <Dialog.Description class="text-base">Are you sure you want to enable Dev Mode?</Dialog.Description>
      </Dialog.Header>

      <Button on:click={enableDevMode} class="bg-purple-600 hover:bg-purple-700 text-neutral-50">Enable Dev Mode</Button>
  </Dialog.Content>
</Dialog.Root>