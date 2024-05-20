<script>
   import { createEventDispatcher } from "svelte";
   import * as Dialog from "$lib/components/ui/dialog";
   import * as AlertDialog from "$lib/components/ui/alert-dialog";
   import * as Table from "$lib/components/ui/table";
   import * as Collapsible from "$lib/components/ui/collapsible";
   import { ScrollArea } from "$lib/components/ui/scroll-area";
   import { Skeleton } from "$lib/components/ui/skeleton";
   import Button from "$lib/components/ui/button/button.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import Input from "$lib/components/ui/input/input.svelte";

   export let isPanelOpen = false;
   export let payload;
   export let toast;
   
   let presets = [];
   let activePresetID;
   let isFetchLoading = false;
   let isConfirmAlertDialogOpen = false;
   let newPresetName;
   let newPresetDescription;
   const dispatch = createEventDispatcher();

   $: onPanelClose(isPanelOpen);

   $: {
      if (isPanelOpen) {
         console.log('Open');
         const presetsLS = localStorage.getItem('user_presets');
         
         if (!presetsLS) {
            getAllPresets();
         } else {
            try {
               presets = JSON.parse(presetsLS);
            } catch (err) {
               toast.error('Couldn\'t load User Presets from Local Storage');
            }
         }
      }
   }

   function onPanelClose() {
      activePresetID = '';
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
   
   async function getAllPresets () {
      isFetchLoading = true;

      const fetchUserPresets = new Promise(async (resolve, reject) => {
         try {
            const allPresetsRequest = await fetch('/api/user-presets');
            const allPresets = await allPresetsRequest.json();
            resolve(allPresets);
         } catch (err) {
            reject(err);
         }
      })

      toast.promise(fetchUserPresets, {
         loading: 'Fetching User Presets from database...',
         success: (_presets) => {
            presets = _presets;
            localStorage.setItem('user_presets', JSON.stringify(presets));
            isFetchLoading = false;
            return 'Users Presets loaded from the database';
         },
         error: (err) => {
            return err.message;
         },
         closeButton: true
      });
   }

   async function saveNewPreset () {
      await fetch('/api/user-presets', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            name: newPresetName,
            description: newPresetDescription,
            payload: JSON.stringify(payload)
         })
      })
      getAllPresets();
      newPresetName = '';
      newPresetDescription = '';
      toast.success(`New preset "${ newPresetName }" saved to the database`);
      // console.log('RESPONSE', response);
   }

   async function updatePreset () {
      const targetPreset = presets.find(preset => preset.id === activePresetID );

      const result = await fetch(`/api/user-presets/${ activePresetID }`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            name: targetPreset.name,
            description: targetPreset.description,
            payload: JSON.stringify(payload)
         })
      })

      getAllPresets();
      // console.log(await result.json());
      console.log('[PRESET UPDATED]');
   }

   async function removePreset () {
      const deleteRequestPromise = new Promise(async (resolve, reject) => {
         try {
            await fetch(`/api/user-presets/${ activePresetID }`, { method: 'DELETE' });
            activePresetID = '';
            resolve();
         } catch (err) {
            reject(err);
         }
      })

      toast.promise(deleteRequestPromise, {
         loading: 'Deleting preset from database...',
         success: (_presets) => {
            getAllPresets();
            return 'Users Presets loaded from the database';
         },
         error: (err) => {
            return err.message;
         }
      });
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[62rem]">
      <Dialog.Header class="flex flex-row justify-between items-center">
         <Dialog.Title class="text-2xl">Payload Presets</Dialog.Title>
         <Button class="mr-3" variant="ghost" size="icon" on:click={getAllPresets}>
            <i class="ti ti-refresh"></i>
         </Button>
      </Dialog.Header>

      <ScrollArea class="h-[20rem]" orientation="vertical">
         {#if isFetchLoading}
            <Table.Root>
               <Table.Header>
                  <Table.Row>
                     <Table.Head class="p-2 h-12">
                        <Skeleton class="w-full h-full" />
                     </Table.Head>
                     <Table.Head class="p-2 h-12">
                        <Skeleton class="w-full h-full" />
                     </Table.Head>
                     <Table.Head class="p-2 h-12">
                        <Skeleton class="w-full h-full" />
                     </Table.Head>
                  </Table.Row>
               </Table.Header>
               <Table.Body>
                  <Table.Row>
                     <Table.Cell class="h-10 p-2">
                        <Skeleton class="w-full h-full" />
                     </Table.Cell>
                     <Table.Cell class="h-10 p-2">
                        <Skeleton class="w-full h-full" />
                     </Table.Cell>
                     <Table.Cell class="h-10 p-2">
                        <Skeleton class="w-full h-full" />
                     </Table.Cell>
                  </Table.Row>
                  
                  <Table.Row>
                     <Table.Cell class="h-10 p-2">
                        <Skeleton class="w-full h-full" />
                     </Table.Cell>
                     <Table.Cell class="h-10 p-2">
                        <Skeleton class="w-full h-full" />
                     </Table.Cell>
                     <Table.Cell class="h-10 p-2">
                        <Skeleton class="w-full h-full" />
                     </Table.Cell>
                  </Table.Row>
               </Table.Body>
            </Table.Root>      
         {:else}
            <Table.Root class="text-base">
               <Table.Header>
                  <Table.Row>
                     <Table.Head class="w-[20rem]">Name</Table.Head>
                     <Table.Head>Description</Table.Head>
                     <Table.Head>Created at</Table.Head>
                     <Table.Head class="w-[20rem]">Updated at</Table.Head>
                  </Table.Row>
               </Table.Header>
               <Table.Body>
                  {#each presets as preset (preset.id)}   
                     {#if activePresetID === preset.id}   
                        <Table.Row class="cursor-pointer text-blue-500" on:click={() => changeSelectedPreset(preset.id)}>
                           <Table.Cell>{ preset.name }</Table.Cell>
                           <Table.Cell>{ preset.description }</Table.Cell>
                           <Table.Cell>{ preset.created_at }</Table.Cell>
                           <Table.Cell>{ preset.updated_at }</Table.Cell>
                        </Table.Row>
                     {:else}
                        <Table.Row class="cursor-pointer" on:click={() => changeSelectedPreset(preset.id)}>
                           <Table.Cell>{ preset.name }</Table.Cell>
                           <Table.Cell class="text-neutral-300">{ preset.description }</Table.Cell>
                           <Table.Cell class="text-neutral-400">{ preset.created_at }</Table.Cell>
                           <Table.Cell class="text-neutral-400">{ preset.updated_at }</Table.Cell>
                        </Table.Row>
                     {/if}
                  {/each}
               </Table.Body>

               <Table.Caption class="text-base">All presets created by the user.</Table.Caption>
            </Table.Root>      
         {/if}
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
                     <Input class="text-base" bind:value={newPresetName} type="text" />
                  </div>
                   
                  <div>
                     <Label class="text-base">Description</Label>
                     <Input class="text-base" bind:value={newPresetDescription} type="text" />
                  </div>
                   
                   <Button variant="secondary" class="float-right" on:click={saveNewPreset}>Save current preset</Button>
               </Collapsible.Content>
            </Collapsible.Root>
   
            <!-- LOAD PRESET -->
            <div class="flex flex-row-reverse w-full mt-3 gap-x-3">
               <Button on:click={loadPreset}>Load preset</Button>
               
               <div class="flex flex-row items-center space-x-3">
                  {#if activePresetID}
                     <p>Preset: { presets.find(preset => preset.id === activePresetID ).name }</p>
                     <Button variant="outline" on:click={() => isConfirmAlertDialogOpen = true}>Update preset</Button>
                     <Button variant="destructive" on:click={removePreset}>Delete preset</Button>
                  {:else}
                     <p>Select a preset</p>
                     <Button disabled variant="outline">Update preset</Button>
                     <Button disabled variant="destructive">Delete preset</Button>
                  {/if}
               </div>
            </div>
         </ScrollArea>
      </Dialog.Footer>
   </Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={isConfirmAlertDialogOpen}>
   <AlertDialog.Content>
       <AlertDialog.Header>
           <AlertDialog.Title>Are you sure you want to update the preset { presets.find(preset => preset.id === activePresetID ).name }?</AlertDialog.Title>
           <AlertDialog.Description class="text-base">This operation cannot be undone.</AlertDialog.Description>
       </AlertDialog.Header>

       <AlertDialog.Footer>
          <AlertDialog.Action on:click={updatePreset}>Update</AlertDialog.Action>
          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      </AlertDialog.Footer>
   </AlertDialog.Content>
</AlertDialog.Root>