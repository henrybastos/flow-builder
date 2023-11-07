<script>
   import Modal from "./Modal.svelte";
   import { FLOW_PRESETS } from "$lib/PresetsStore";
   import PAYLOAD from "$lib/PayloadStore";
   export let presetsModal;
   let newPresetName;

   function savePreset () {
        PAYLOAD.setStrictFlows(true);
        PAYLOAD.addFlow('flow_01');
        PAYLOAD.addCommand('flow_01', { command: 'Bark!' });
        PAYLOAD.addCommand('main_flow', { command: 'Miaw!' });
        FLOW_PRESETS.savePreset({ [newPresetName]: { ...$PAYLOAD } });

        // PAYLOAD.addFlow('flow_01');
        // PAYLOAD.addCommand('flow_01', { command: 'goto', link: 'my_link_dot_com' });
        // console.log($PAYLOAD);

        console.log('Preset saved!');
        newPresetName = '';
    }

    function clearPresets () {
        FLOW_PRESETS.clearPresets();
    }

    function removePreset (_preset_name) {
        FLOW_PRESETS.removePreset(_preset_name);
    }

    function loadPreset (_preset_name) {
        PAYLOAD.loadPreset($FLOW_PRESETS[_preset_name]);
        console.log($PAYLOAD);
        presetsModal.close();
    }

    function editPreset () {
        console.log('Edit preset!');
    }

    export function open () {
        // exportFlowsToJson();
        presetsModal.open();
    }
</script>

<Modal bind:this={presetsModal} title="Presets">
   <div class="btn-bar mb-3">
       {#each Object.keys($FLOW_PRESETS) as preset_name}
           <div class="flex flex-row col-span-full">
               <button class="btn-md grow" on:click={() => loadPreset(preset_name)}>
                   <i class="ti ti-bookmark-filled text-blue-500"></i>
                   { preset_name }
               </button>
               <!-- <button class="btn-md" on:click={() => editPreset(preset_name)}>
                   <i class="ti ti-ballpen"></i>
               </button> -->
               <button class="btn-md btn-danger" on:click={() => removePreset(preset_name)}>
                   <i class="ti ti-trash-x"></i>
               </button>
           </div>
       {/each}
   </div>
   
   <div class="btn-bar">
       <button on:click={clearPresets} class="btn-md btn-danger w-full">
           <i class="ti ti-book-download"></i>
           Clear presets
       </button>

       <button on:click={loadPreset} class="btn-md w-full">
           <i class="ti ti-book-download text-blue-500"></i>
           Load Presets
       </button>

       <input class="input-md peer/preset-name" bind:value={newPresetName} type="text" placeholder="Preset name">
       <button on:click={savePreset} class="btn-md w-full">
           <i class="ti ti-book-upload text-blue-500"></i>
           Save Preset
       </button>
       <p class="text-red-600 col-span-full peer-invalid/preset-name:visible invisible">Invalid preset name</p>

   </div>
</Modal>