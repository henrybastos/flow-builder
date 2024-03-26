<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Switch from "$lib/components/ui/switch/switch.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import { onMount } from "svelte"
   import Button from "$lib/components/ui/button/button.svelte";

   let defaultDevSettings = {
      headless: true,
      close_browser_on_finish: false
   };

   export let isPanelOpen = false;
   export let devSettings = defaultDevSettings;

   $: headless = devSettings?.headless;
   $: close_browser_on_finish = devSettings?.close_browser_on_finish;

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
         console.log('%c[DEV SETTINGS]', 'color:#06b6d4;', devSettings);
      };
   })
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="min-w-[60rem] overflow-hidden">
      <Dialog.Header>
         <Dialog.Title>Dev settings</Dialog.Title>
         <Dialog.Description class="text-base">All settings saves automatically.</Dialog.Description>
      </Dialog.Header>

      <div class="inline-flex items-center">
         <Switch bind:checked={headless} onCheckedChange={(checked) => updateLS('headless', checked)} id="headless_mode" />
         <Label class="text-base ml-2" for="headless_mode">Headless mode</Label>
      </div>

      <div class="inline-flex items-center">
         <Switch bind:checked={close_browser_on_finish} onCheckedChange={(checked) => updateLS('close_browser_on_finish', checked)} id="close_browser_on_finish_option" />
         <Label class="text-base ml-2" for="close_browser_on_finish_option">Close broswer on finish</Label>
      </div>

      <Dialog.Footer class="pb-5">
         <Button on:click={resetSettings} variant="destructive">Reset settings</Button>
      </Dialog.Footer>

      <span class="absolute bottom-0 w-full bg-purple-600 text-sm text-center font-code py-1">DEV</span>
   </Dialog.Content>
</Dialog.Root>
