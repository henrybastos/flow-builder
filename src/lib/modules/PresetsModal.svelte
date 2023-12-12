<script>
   import Modal from "../components/Modal.svelte";
   import { FLOW_PRESETS, CURRENT_PRESET_NAME } from "$lib/PresetsStore";
   import { PAYLOAD } from "$lib/PayloadStore";
   import { createEventDispatcher, onMount } from "svelte";
   import { checkClickOnGuideIDs } from "$lib/utils";

   let ALL_PRESETS = {};
   let presetsModal;
   let inputPresetName;
   let isPresetNameEditable = '';
   let presetNameEdit;
   export let showGlobalToast;

   const dispatch = createEventDispatcher();

    onMount(async () => {
        await loadAllPresetsFromLibrary();
    })

    async function loadAllPresetsFromLibrary () {
        ALL_PRESETS = await FLOW_PRESETS.loadAllPresetsFromLibrary();

        for(const [preset_name, preset_payload] of Object.entries(ALL_PRESETS)) {
            FLOW_PRESETS.savePreset({ [preset_name.match(/[^\s].*(?=\.json)/g)]: { ...preset_payload }});
        }

        $FLOW_PRESETS = $FLOW_PRESETS;
    }

   async function savePreset () {
        PAYLOAD._fix_fixNullConfig();
        FLOW_PRESETS.savePresetToLibrary({ [inputPresetName || 'New Preset']: { ...$PAYLOAD } });
        await loadAllPresetsFromLibrary();
        $CURRENT_PRESET_NAME = inputPresetName;
        dispatch('preset_loaded', { presetName: inputPresetName });
        console.log('Preset saved!');
        inputPresetName = '';
    }

    function clearPresets () {
        FLOW_PRESETS.clearPresets();
        presetsModal.close();
        showGlobalToast('Presets cleared', 'success');
    }

    function removePreset (_preset_name) {
        FLOW_PRESETS.removePreset(_preset_name);
    }

    function loadPreset (_preset_name) {
        $CURRENT_PRESET_NAME = _preset_name;
        PAYLOAD.loadPayload($FLOW_PRESETS[_preset_name]);

        if (!$PAYLOAD?.config) {
            console.log('[FIX] No config found. Loading empty one...');
            PAYLOAD._fix_fixNullConfig();
        }

        dispatch('preset_loaded', { presetName: _preset_name, presetBody: $PAYLOAD });
        // console.log($FLOW_PRESETS[_preset_name]);
        presetsModal.close();
    }

    function updatePreset (_preset_name) {
        console.log($PAYLOAD);
        FLOW_PRESETS.savePresetToLibrary({ [_preset_name]: { ...$PAYLOAD } });
        console.log('Preset updated!');
    }

    function renamePreset (_old_preset_name, _new_preset_name) {
        FLOW_PRESETS.savePresetToLibrary({ [_preset_name]: { ...$PAYLOAD } });
        // FLOW_PRESETS.renamePreset(_old_preset_name, _new_preset_name);
        if ($CURRENT_PRESET_NAME === _old_preset_name) {
            $CURRENT_PRESET_NAME = _new_preset_name;
        }
        isPresetNameEditable = '';
    }

    export function open () {
        // exportFlowsToJson();
        presetsModal.open();
    }

    function toggleEditPresetName (_preset_name) {
        if (isPresetNameEditable === _preset_name) {
            isPresetNameEditable = '';            
        } else {
            isPresetNameEditable = _preset_name;
            presetNameEdit = _preset_name;
        }
    }

    function _window_checkEditPresetNameClick (_target) {
        // Disables isPresetNameEditable if click is not the Edit Preset Name button or icon
        const allowedEditPresetGuideIDs = [
            'edit_preset_name_icon', 
            'edit_preset_name_btn', 
            'edit_preset_name_input',
            'save_preset_name',
            'save_preset_name_icon'
        ]
        if (!checkClickOnGuideIDs(allowedEditPresetGuideIDs, _target)) {
            isPresetNameEditable = ''; 
        }
    }

    function _window_handleClicks (_event) {
        _window_checkEditPresetNameClick(_event.target);
    }
</script>

<svelte:window on:click={_window_handleClicks} />

<button on:click={() => presetsModal.open()} class="btn-md">
    <i class="ti ti-bookmarks text-blue-500"></i>
    Presets
</button>

<Modal 
    bind:this={presetsModal} 
    title="Presets" 
    let:showDanger 
>
   <div class="btn-bar mb-3 overflow-y-auto max-h-[30rem] p-3 border-2 border-neutral-800 bg-neutral-950 rounded-lg">
       {#each Object.keys($FLOW_PRESETS) as preset_name}
       <!-- {#each Object.keys(ALL_PRESETS) as preset_name} -->
           <div class="flex flex-nowrap col-span-full gap-x-3">
                {#if isPresetNameEditable === preset_name}
                    <input data-guide-id="edit_preset_name_input" class="btn-md col-span-full w-full outline-offset-1" type="text" bind:value={ presetNameEdit }>

                    {#if presetNameEdit.trim() !== preset_name.trim()}    
                        <button data-guide-id="save_preset_name" class="btn-md" on:click={() => renamePreset(preset_name, presetNameEdit)}>
                            <i data-guide-id="save_edit_preset_name_icon" class="ti ti-device-floppy text-green-500"></i>
                        </button>
                    {/if}
                {:else}
                    <button class="btn-md col-span-full w-full outline-offset-1" on:click={() => loadPreset(preset_name)}>
                        <i class="ti ti-bookmark-filled text-blue-500"></i>
                        { preset_name }
                    </button>
                {/if}

               <!-- Edit preset name -->
               <button data-guide-id="edit_preset_name_btn" class="btn-md" on:click={() => toggleEditPresetName(preset_name)}>
                   <i data-guide-id="edit_preset_name_icon" class="ti ti-ballpen"></i>
               </button>

               <!-- Update preset -->
               <button class="btn-md" on:click={() => showDanger(() => updatePreset(preset_name), { danger_modal_title: `Update preset ${ preset_name }?` })}>
                   <i class="ti ti-arrows-transfer-up"></i>
               </button>

               <!-- Delete preset -->
               <button class="btn-md btn-danger" on:click={() => showDanger(() => removePreset(preset_name), { danger_modal_title: `Delete preset ${ preset_name }?` })}>
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

       <button on:click={loadPreset} class="btn-md btn-disabled w-full">
           <i class="ti ti-book-download text-blue-500"></i>
           Load Preset
       </button>

       <input class="input-md peer/preset-name" bind:value={inputPresetName} type="text" placeholder="Preset name">
       <button on:click={savePreset} class="btn-md w-full">
           <i class="ti ti-book-upload text-blue-500"></i>
           Save Preset
       </button>

       <p class="text-red-600 col-span-full peer-invalid/preset-name:visible invisible">Invalid preset name</p>
   </div>
</Modal>