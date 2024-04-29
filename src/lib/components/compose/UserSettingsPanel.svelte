<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Switch from "$lib/components/ui/switch/switch.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import { onMount } from "svelte"
   import Button from "$lib/components/ui/button/button.svelte";
   import { fade } from "svelte/transition";
   import Separator from "$lib/components/ui/separator/separator.svelte";
   import { toast } from "svelte-sonner";

   const COMMANDS_ERROR_OUTPUT_SCHEMA = {
      flow_builder_update: 'Falha ao atualizar o Flow Builder',
      flow_blocks_update: 'Falha ao atualizar o Flow Compose Blocks'
   }

   let changesMade = false;
   let defaultUserSettings = {
      close_env_panel_on_outside_click: false
   };

   export let isPanelOpen = false;
   export let userSettings;

   $: close_env_panel_on_outside_click = userSettings?.close_env_panel_on_outside_click ?? false;

   function updateLS (setting, value) {
      changesMade = true;
      console.log(userSettings, setting, value);
      userSettings[setting] = value;
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      setTimeout(() => changesMade = false, 3000);
   }

   function resetSettings () {
      userSettings = defaultUserSettings;
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
   }

   async function gitUpdate (branch) {
      console.log('Updating...');

      const updatePromise = new Promise(async (resolve, reject) => {
         try {
            const response = await fetch('/api/git-update', {
               method: 'POST',
               body: JSON.stringify({ branch })
            });
   
            resolve(await response.json());
         } catch (err) {
            reject(err);
         }
      })

      toast.promise(updatePromise, {
         loading: 'Verificando atualizações...',
         success: ({ commands_output }) => {
            // console.log(commands_output);

            const errorMessage = commands_output.map(output => {
               if (output.exit_code === 1) {
                  return COMMANDS_ERROR_OUTPUT_SCHEMA[output.label];
               }
            }).filter(v => v);
            
            if (errorMessage.length > 0) {
               console.log(errorMessage);
               throw new Error(errorMessage[0]);
            }
            
            console.log('Update done.');
            return 'Atualização feita com sucesso';
         }, 
         error: (err) => {
            console.log('[ERROR]', err.message);
            console.log('Update done.');
            return err.message;
         }
      })
   }

   onMount(() => {
      const userSettingsLS = localStorage.getItem('userSettings');

      if (userSettingsLS) { 
         userSettings = JSON.parse(userSettingsLS);
      } else {
         localStorage.setItem('userSettings', JSON.stringify(defaultUserSettings));
         userSettings = defaultUserSettings;
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
         <h2 class="text-lg font-semibold mb-3">Painel de variáveis</h2>
   
         <div class="flex flex-col space-y-2">
            <div class="inline-flex items-center">
               <Switch bind:checked={close_env_panel_on_outside_click} onCheckedChange={(checked) => updateLS('close_env_panel_on_outside_click', checked)} id="close_env_panel_on_outside_click_option" />
               <Label class="text-base ml-2" for="close_env_panel_on_outside_click_option">Fechar ao clicar fora</Label>
            </div>
         </div>
      </div>

      <Separator />

      <div>
         <h2 class="text-lg font-semibold mb-3">Atualizações</h2>

         <div class="flex flex-col space-y-2">
            <div class="space-x-2">
               <Button class="border-green-500" on:click={() => gitUpdate('main')} variant="outline">
                  <i class="ti ti-cloud-download mr-3"></i>
                  Atualizar Flow Builder
               </Button>
            </div>
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
