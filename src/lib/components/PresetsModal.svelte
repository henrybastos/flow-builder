<script>
   import Modal from "./Modal.svelte";
   export let presetList
   export let presetsModal;
   export let newPresetName;

   export let loadPresetHandler;
   export let editPresetHandler;
   export let savePresetHandler;
   export let deletePresetHandler;

   export let clearPresetsHandler;
   export let loadPresetFileHandler;
</script>

<Modal bind:this={presetsModal} title="Presets">
   <div class="btn-bar mb-3">
       {#each Object.keys(presetList) as preset_name}
           <div class="grid grid-cols-6 col-span-full">
               <button class="btn-md w-full col-span-4" on:click={() => loadPresetHandler(preset_name)}>
                   <i class="ti ti-bookmark-filled text-blue-500"></i>
                   { preset_name }
               </button>
               <button class="btn-md col-span-1" on:click={() => editPresetHandler(preset_name)}>
                   <i class="ti ti-ballpen"></i>
               </button>
               <button class="btn-md btn-danger col-span-1" on:click={() => deletePresetHandler(preset_name)}>
                   <i class="ti ti-trash-x"></i>
               </button>
           </div>
       {/each}
   </div>
   <div class="btn-bar">
       <button on:click={clearPresetsHandler} class="btn-md btn-danger w-full">
           <i class="ti ti-book-download"></i>
           Clear presets
       </button>

       <button on:click={loadPresetFileHandler} class="btn-md w-full">
           <i class="ti ti-book-download text-blue-500"></i>
           Load Presets
       </button>

       <input class="input-md peer/preset-name" bind:value={newPresetName} type="text" placeholder="Preset name">
       <button on:click={savePresetHandler} class="btn-md w-full">
           <i class="ti ti-book-upload text-blue-500"></i>
           Save Preset
       </button>
       <p class="text-red-600 col-span-full peer-invalid/preset-name:visible invisible">Invalid preset name</p>

   </div>
</Modal>