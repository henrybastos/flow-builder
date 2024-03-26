<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Switch from "$lib/components/ui/switch/switch.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import { onMount } from "svelte"
   import Button from "$lib/components/ui/button/button.svelte";
   import { fade } from "svelte/transition";
    import Separator from "$lib/components/ui/separator/separator.svelte";

   let changesMade = false;
   let defaultUserSettings = {
      close_env_panel_on_outside_click: false
   };

   export let isPanelOpen = false;
   export let userSettings = defaultUserSettings;

   $: close_env_panel_on_outside_click = userSettings?.close_env_panel_on_outside_click;

   function updateLS (setting, value) {
      changesMade = true;
      userSettings[setting] = value;
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      setTimeout(() => changesMade = false, 3000);
   }

   function resetSettings () {
      userSettings = defaultUserSettings;
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
   }

   onMount(() => {
      const userSettingsLS = localStorage.getItem('userSettings');

      if (userSettingsLS) { 
         userSettings = JSON.parse(userSettingsLS);
      };
   })
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="min-w-[60rem]">
      <Dialog.Header>
         <Dialog.Title>Configurações do usuário</Dialog.Title>
         <Dialog.Description class="text-base">Todas as configurações salvam automaticamente.</Dialog.Description>
      </Dialog.Header>

      <Separator />

      <div>
         <h2 class="text-lg font-semibold mb-2">Painel de variáveis</h2>
   
         <div class="inline-flex items-center">
            <Switch bind:checked={close_env_panel_on_outside_click} onCheckedChange={(checked) => updateLS('close_env_panel_on_outside_click', checked)} id="close_env_panel_on_outside_click_option" />
            <Label class="text-base ml-2" for="close_env_panel_on_outside_click_option">Fechar ao clicar fora</Label>
         </div>
      </div>

      <Dialog.Footer>
         {#if changesMade}
            <span transition:fade={{ duration: 250 }} class="mr-auto text-green-600 pt-3">Configurações salvas</span>
         {/if}
         <Button on:click={resetSettings} variant="destructive">Reset settings</Button>
      </Dialog.Footer>
   </Dialog.Content>
</Dialog.Root>
