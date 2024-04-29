<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import Switch from "$lib/components/ui/switch/switch.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import { onMount } from "svelte"
   import Button from "$lib/components/ui/button/button.svelte";
   import Separator from "$lib/components/ui/separator/separator.svelte";
   import Badge from "$lib/components/ui/badge/badge.svelte";

   let defaultDevSettings = {
      headless: true,
      close_browser_on_finish: false
   };

   export let toast;
   export let isPanelOpen = false;
   export let devSettings = defaultDevSettings;

   const COMMANDS_ERROR_OUTPUT_SCHEMA = {
      flow_builder_update: 'Falha ao atualizar o Flow Builder',
      flow_blocks_update: 'Falha ao atualizar o Flow Compose Blocks',
      git_branch: 'A branch atual não é a "dev_lab"'
   }

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
               const branchDevLabCheck = output.label === 'git_branch' ? output.output.match(/\* dev_lab/g) : true;
               
               if (output.exit_code === 1 || !branchDevLabCheck) {
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
      
      <div>
         <h2 class="text-lg font-semibold mb-3">Config</h2>
         
         <div class="flex flex-col space-y-2">
            <div class="inline-flex items-center">
               <Switch bind:checked={headless} onCheckedChange={(checked) => updateLS('headless', checked)} id="headless_mode" />
               <Label class="text-base ml-2" for="headless_mode">Headless mode</Label>
            </div>
      
            <div class="inline-flex items-center">
               <Switch bind:checked={close_browser_on_finish} onCheckedChange={(checked) => updateLS('close_browser_on_finish', checked)} id="close_browser_on_finish_option" />
               <Label class="text-base ml-2" for="close_browser_on_finish_option">Close broswer on finish</Label>
            </div>
         </div>
      </div>

      <Separator />

      <div>
         <h2 class="text-lg font-semibold mb-3">Updates</h2>

         <div class="space-x-2">
            <Button class="border-purple-600" on:click={() => gitUpdate('dev_lab')} variant="outline">
               <i class="ti ti-cloud-download mr-3"></i>
               Update Flow Builder
               <Badge class="ml-2 bg-purple-600 text-neutral-50 pointer-events-none">DEV_LAB</Badge>
            </Button>
         </div>
      </div>

      <Dialog.Footer class="pb-5">
         <Button on:click={resetSettings} variant="destructive">Reset settings</Button>
      </Dialog.Footer>

      <span class="absolute bottom-0 w-full bg-purple-600 text-sm text-center font-code py-1">DEV</span>
   </Dialog.Content>
</Dialog.Root>
