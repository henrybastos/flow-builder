<script>
   import { createEventDispatcher } from "svelte";
   import * as Dialog from "$lib/components/ui/dialog";
   import * as Table from "$lib/components/ui/table";
   import * as Collapsible from "$lib/components/ui/collapsible";
   import { ScrollArea } from "$lib/components/ui/scroll-area";
   import Button from "../ui/button/button.svelte";
   import Label from "../ui/label/label.svelte";
   import Input from "../ui/input/input.svelte";

   export let isPanelOpen = false;
   export let payload;

   let activePresetID;
   const dispatch = createEventDispatcher();
   const presets = [
      {
         id: 'preset_001',
         name: 'Tabler.io Scraper',
         description: 'Scrapes icons from Tabler.io',
         date: '26/04/2024 - 14h21',
         payload: '{"env": {"email": "kebook.programacao.2@gmail.com","password": "4mYR51pz!"},"flows": {"main_flow": [{"command": "run_flow","enabled": true,"flow": "login"}],"login": [{"command": "goto","enabled": true,"target": "https://accounts.google.com/ServiceLogin?hl=en-US&theme=mn&passive=true&continue=https://www.google.com/&ec=GAZAmgQ"},{"command": "eval_expression","enabled": false,"expression": "env({ \'@private:new_url\': \`${ window.location.href.replace(\'glif\', \'mn\') }&hl=en-US\` })"},{"command": "goto","enabled": false,"target": "@@new_url@"},{"command": "wait_seconds","enabled": true,"time": "2000"},{"command": "keyboard_type","enabled": true,"target": "//*/input[@type=\'email\']","value": "@@email@"},{"command": "wait_seconds","enabled": true,"time": "2000"},{"command": "click","enabled": true,"target": "//*/div//*[text()=\'Next\']"},{"command": "branch_eval","enabled": true,"expression": "wait_for_element(90, \`//input[@name=\"Passwd\"]\`)","success_flow": "captcha_pass","error_flow": "auth_error"}],"captcha_pass": [{"command": "wait_seconds","enabled": true,"time": "3000"},{"command": "keyboard_type","enabled": true,"target": "//*/input[@type=\'password\']","value": "@@password@"},{"command": "click","enabled": true,"target": "//*/div//*[text()=\'Next\']"},{"command": "wait_seconds","enabled": true,"time": "5000"},{"command": "branch_eval","enabled": true,"expression": "async_eval(6, 1000, res => {const verifyBtn = x(\'//*[contains(text(), \"Use another phone or\")]\');if (!verifyBtn) {res(\'Verificação OK!\');} else {verifyBtn.click();return { error: \'Verifique sua conta do Google no link https://g.co/verifyaccount e depois execute o bloco novamente.\' }}})","success_flow": "","error_flow": "auth_needed"}],"auth_needed": [{"command": "eval_expression","enabled": true,"expression": "env({ erro: \'Verifique sua conta do Google no link https://g.co/verifyaccount e em seguida execute o bloco novamente.\' })"},{"command": "close_browser","enabled": true}],"auth_error": [{"command": "eval_expression","enabled": true,"expression": "env({ auth_error: \'Erro ao autenticar o login no Google.\' })"}]},"config": {"ws_endpoint": "","close_browser_on_finish": false,"close_browser_on_cancel_request": false,"headless": false}}'
      },
      {
         id: 'preset_002',
         name: 'YouTube Scraper',
         description: 'Scrapes video data from YouTube',
         date: '29/04/2024 - 09h43',
         payload: '{"env": {"_$fb": {"pages": {"main_page": "main_page"}}},"flows": {"main_flow": []},"config": {"ws_endpoint": "","close_browser_on_finish": false,"close_browser_on_cancel_request": false,"headless": false}}'
      },
   ];

   $: onPanelClose(isPanelOpen);

   function onPanelClose() {
      activePresetID = '';
      console.log(activePresetID);
   }

   function changeSelectedPreset (presetID) {
      if (activePresetID === presetID) {
         activePresetID = '';
      } else {
         activePresetID = presetID;
      }
   }

   function loadPreset () {
      dispatch('loadpreset', { preset: presets.find(preset => preset.id === activePresetID ) });
      isPanelOpen = false;
   }

   function savePreset () {
      console.log();
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[50rem]">
      <Dialog.Header>
         <Dialog.Title class="text-2xl">Payload Presets</Dialog.Title>
      </Dialog.Header>

      <ScrollArea class="max-h-[30rem]" orientation="vertical">
          <Table.Root class="text-base">
            <Table.Caption class="text-base">All user payload presets.</Table.Caption>
            <Table.Header>
               <Table.Row>
                  <Table.Head class="w-[10rem]">Name</Table.Head>
                  <Table.Head>Description</Table.Head>
                  <Table.Head>Date</Table.Head>

               </Table.Row>
            </Table.Header>
            <Table.Body>
               {#each presets as preset}   
                  {#if activePresetID === preset.id}   
                     <Table.Row class="cursor-pointer text-blue-500" on:click={() => changeSelectedPreset(preset.id)}>
                        <Table.Cell>{ preset.name }</Table.Cell>
                        <Table.Cell>{ preset.description }</Table.Cell>
                        <Table.Cell>{ preset.date }</Table.Cell>
                     </Table.Row>
                  {:else}
                     <Table.Row class="cursor-pointer" on:click={() => changeSelectedPreset(preset.id)}>
                        <Table.Cell>{ preset.name }</Table.Cell>
                        <Table.Cell>{ preset.description }</Table.Cell>
                        <Table.Cell>{ preset.date }</Table.Cell>
                     </Table.Row>
                  {/if}
               {/each}
            </Table.Body>
         </Table.Root>      
      </ScrollArea>

      <Dialog.Footer>
         <ScrollArea class="max-h-[30rem] flex flex-col flex-wrap w-full" orientation="vertical">

            <!-- SAVE NEW PRESET COLLAPSIBLE -->
            <Collapsible.Root class="border-b flex flex-col border-neutral-700 p-2 space-x-1 group/collapsible w-full">
               <div class="flex flex-row">
                   <Collapsible.Trigger class="flex flex-row grow justify-between items-center">
                       <h3 class="text-lg">Save new preset</h3>
            
                       <div class="inline-flex justify-center items-center space-x-2 text-base">
                           <i class="ti ti-chevron-down group-data-[state=open]/collapsible:rotate-180"></i>
                       </div>
                   </Collapsible.Trigger>
               </div>
            
               <Collapsible.Content class="py-2 space-y-3">
                  <div>
                     <Label class="text-base">Preset name</Label>
                     <Input type="text" />
                  </div>
                   
                  <div>
                     <Label class="text-base">Description</Label>
                     <Input type="text" />
                  </div>
                   
                   <Button variant="secondary" class="float-right" on:click={loadPreset}>Save preset</Button>
               </Collapsible.Content>
            </Collapsible.Root>
   
            <!-- LOAD PRESET -->
            <div class="flex flex-row-reverse w-full mt-3 gap-x-3">
               <Button on:click={loadPreset}>Load preset</Button>

               {#if activePresetID}
                  <p>Active preset: { presets.find(preset => preset.id === activePresetID ).name }</p>
               {:else}
                  <p>Select a preset</p>
               {/if}
            </div>
         </ScrollArea>
      </Dialog.Footer>
   </Dialog.Content>
</Dialog.Root>