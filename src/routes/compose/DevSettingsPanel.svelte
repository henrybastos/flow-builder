<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Switch from "$lib/components/ui/switch/switch.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import { onMount } from "svelte"
    import Button from "$lib/components/ui/button/button.svelte";

   export let isPanelOpen = false;
   export let devSettings;
   export let defaultDevSettings;

   $: headless = devSettings.headless;

   function updateLS (setting, value) {
      devSettings[setting] = value;
      localStorage.setItem('devSettings', JSON.stringify(devSettings));
   }

   function resetSettings () {
      devSettings = defaultDevSettings;
      localStorage.setItem('devSettings', JSON.stringify(devSettings));
   }

   onMount(() => {
      const devSettingsLS = localStorage.getItem('devSettings');

      if (devSettingsLS) { 
         devSettings = JSON.parse(devSettingsLS);
      };
   })
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="min-w-[60rem]">
      <Dialog.Header>
         <Dialog.Title>Dev settings</Dialog.Title>
         <Dialog.Description class="text-base">All settings saves automatically.</Dialog.Description>
      </Dialog.Header>

      <div class="inline-flex items-center">
         <Switch bind:checked={headless} onCheckedChange={(checked) => updateLS('headless', checked)} id="headless_mode" />
         <Label class="text-base ml-2" for="headless_mode">Headless mode</Label>
      </div>
      <Dialog.Footer>
         <Button on:click={resetSettings} variant="destructive">Reset settings</Button>
      </Dialog.Footer>
   </Dialog.Content>
</Dialog.Root>
