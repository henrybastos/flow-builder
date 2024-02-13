<script>
    import Modal from "../components/Modal.svelte";
    import { FLOW_PRESETS, CURRENT_PRESET_NAME } from "$lib/PresetsStore";
    import { PAYLOAD } from "$lib/PayloadStore";
    import { createEventDispatcher, onMount } from "svelte";
    import { checkClickOnGuideIDs } from "$lib/utils";
    import { getContext } from "svelte";
    import { slide } from "svelte/transition";
    import * as Dialog from "$lib/components/ui/dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Input from "$lib/components/ui/input/input.svelte";

    let presetsModal;
    let showToast;
    let inputPresetName;
    let isPresetNameEditable = "";
    let presetNameEdit;
    let isControlDown = false;
    let isDialogOpen;
    let selectedPresets = new Set();
    export let showGlobalToast;

    $: currentPresetName = [...selectedPresets.values()][0];

    const dispatch = createEventDispatcher();
    const loadAllPresetsFromLibrary = getContext("loadAllPresetsFromLibrary");

    async function savePreset(_preset_name) {
        try {
            PAYLOAD._fix_fixNullConfig();

            $CURRENT_PRESET_NAME = _preset_name;
            FLOW_PRESETS.savePresetToLibrary({
                [_preset_name || "New Preset"]: { ...$PAYLOAD },
            });
            dispatch("preset_loaded", {
                presetName: _preset_name,
                presetBody: $PAYLOAD,
            });
            // showToast(`Preset ${_preset_name} saved.`, "success");
            inputPresetName = "";
            await loadAllPresetsFromLibrary();
            $FLOW_PRESETS = $FLOW_PRESETS;
        } catch (err) {
            console.error(err);
            // showToast(`Preset could not be saved.`, "error");
        }
    }

    function clearPresets() {
        FLOW_PRESETS.clearPresets();
        presetsModal.close();
        showGlobalToast("Presets cleared", "success");
    }

    function removePreset(_preset_name) {
        FLOW_PRESETS.removePreset(_preset_name);
    }

    function loadPreset(_preset_name) {
        $CURRENT_PRESET_NAME = _preset_name;
        PAYLOAD.loadPayload($FLOW_PRESETS[_preset_name]);

        if (!$PAYLOAD?.config) {
            console.log("[FIX] No config found. Loading empty one...");
            PAYLOAD._fix_fixNullConfig();
        }

        dispatch("preset_loaded", {
            presetName: _preset_name,
            presetBody: $PAYLOAD,
        });
        // console.log($FLOW_PRESETS[_preset_name]);
        // presetsModal.close();
        isDialogOpen = false;
    }

    async function updatePreset(_preset_name) {
        await savePreset(_preset_name);
    }

    function renamePreset(_old_preset_name, _new_preset_name) {
        FLOW_PRESETS.savePresetToLibrary({ [_preset_name]: { ...$PAYLOAD } });
        // FLOW_PRESETS.renamePreset(_old_preset_name, _new_preset_name);
        if ($CURRENT_PRESET_NAME === _old_preset_name) {
            $CURRENT_PRESET_NAME = _new_preset_name;
        }
        isPresetNameEditable = "";
    }

    export function open() {
        // exportFlowsToJson();
        presetsModal.open();
    }

    function toggleEditPresetName(_preset_name) {
        // if (isPresetNameEditable === _preset_name) {
        //     isPresetNameEditable = '';
        // } else {
        //     isPresetNameEditable = _preset_name;
        //     presetNameEdit = _preset_name;
        // }
        isPresetNameEditable = !isPresetNameEditable;
    }

    function selectPreset(_preset_name) {
        if (isControlDown) {
            if (selectedPresets.has(_preset_name)) {
                selectedPresets.delete(_preset_name);
            } else {
                selectedPresets.add(_preset_name);
            }
        } else {
            if (selectedPresets.has(_preset_name)) {
                selectedPresets.clear();
            } else {
                selectedPresets = new Set([_preset_name]);
            }
        }

        // Svelte reactive get around 💀
        selectedPresets = new Set(selectedPresets);
    }

    function _window_checkEditPresetNameClick(_target) {
        // Disables isPresetNameEditable if click is not the Edit Preset Name button or icon
        const allowedEditPresetGuideIDs = [
            "edit_preset_name_icon",
            "edit_preset_name_btn",
            "edit_preset_name_input",
            "save_preset_name",
            "save_preset_name_icon",
        ];
        // if (!checkClickOnGuideIDs(allowedEditPresetGuideIDs, _target)) {
        //     isPresetNameEditable = '';
        // }
    }

    function _window_handleClicks(_event) {
        _window_checkEditPresetNameClick(_event.target);
    }

    function _window_handleKeyDown({ key }) {
        if (key === "Control" && !isControlDown) {
            isControlDown = true;
            console.log(isControlDown);
        }
    }

    function _window_handleKeyUp({ key }) {
        isControlDown = false;
    }
</script>

<svelte:window
    on:keydown={_window_handleKeyDown}
    on:keyup={_window_handleKeyUp}
    on:click={_window_handleClicks}
/>

<Dialog.Root bind:open={isDialogOpen}>
    <Dialog.Trigger asChild let:builder>
        <Button variant="secondary" class="w-28" builders={[builder]}>Presets</Button>
    </Dialog.Trigger>
    <Dialog.Content class="max-w-[80rem]">
        <div id="presets_header" class="mb-3">
            <button
                class="clear-btn"
                disabled={selectedPresets.size === 0 ||
                    selectedPresets.size > 1}
                on:click={() => loadPreset(currentPresetName)}
            >
                Load preset
            </button>

            <button
                class="clear-btn"
                disabled={selectedPresets.size === 0 ||
                    selectedPresets.size > 1}
                on:click={() => toggleEditPresetName(currentPresetName)}
            >
                Rename
            </button>

            <button
                class="clear-btn"
                disabled={selectedPresets.size === 0 ||
                    selectedPresets.size > 1}
                on:click={() =>
                    showDanger(
                        async () => await updatePreset(currentPresetName),
                        {
                            danger_modal_title: `Update preset ${currentPresetName}?`,
                        },
                    )}
            >
                Update preset
            </button>

            <!-- WIP -->
            <button
                class="clear-btn"
                disabled={selectedPresets.size === 0 || true}
            >
                Delete presets
            </button>

            {#if isPresetNameEditable}
                <div transition:slide>
                    <input
                        class="input border-none bg-neutral-950 hover:bg-neutral-950 p-2 rounded w-full"
                        type="text"
                        placeholder="New preset name"
                    />
                </div>
            {/if}
        </div>

        <div
            class="btn-bar mb-3 overflow-y-auto max-h-[30rem] p-3 border-2 border-neutral-800 bg-neutral-950 rounded-lg"
        >
            {#each Object.keys($FLOW_PRESETS) as preset_name}
                <div class="flex flex-wrap gap-x-2">
                    {#if isPresetNameEditable === preset_name}
                        <input
                            data-guide-id="edit_preset_name_input"
                            class="btn-md col-span-full w-full outline-offset-1"
                            type="text"
                            bind:value={presetNameEdit}
                        />

                        {#if presetNameEdit.trim() !== preset_name.trim()}
                            <button
                                data-guide-id="save_preset_name"
                                class="btn-md"
                                on:click={() =>
                                    renamePreset(preset_name, presetNameEdit)}
                            >
                                <i
                                    data-guide-id="save_edit_preset_name_icon"
                                    class="ti ti-device-floppy text-green-500"
                                ></i>
                            </button>
                        {/if}
                    {:else}
                        <!-- <button class="preset_block" on:click={() => loadPreset(preset_name)}> -->
                        <button
                            class:selected={selectedPresets.has(preset_name)}
                            class="preset_block"
                            on:click={() => selectPreset(preset_name)}
                        >
                            <!-- <i class="ti ti-bookmark-filled text-blue-500"></i> -->
                            {preset_name}
                        </button>
                    {/if}

                    <!-- Edit preset name -->
                    <!-- <button data-guide-id="edit_preset_name_btn" class="btn-md" on:click={() => toggleEditPresetName(preset_name)}>
                       <i data-guide-id="edit_preset_name_icon" class="ti ti-ballpen"></i>
                   </button> -->

                    <!-- Update preset -->
                    <!-- <button class="btn-md" on:click={() => showDanger(() => updatePreset(preset_name), { danger_modal_title: `Update preset ${ preset_name }?` })}>
                       <i class="ti ti-arrows-transfer-up"></i>
                   </button> -->

                    <!-- Delete preset -->
                    <!-- <button class="btn-md btn-danger" on:click={() => showDanger(() => removePreset(preset_name), { danger_modal_title: `Delete preset ${ preset_name }?` })}>
                       <i class="ti ti-trash-x"></i>
                   </button> -->
                </div>
            {/each}
        </div>

        <!-- <div class="btn-bar">
            <button on:click={clearPresets} class="btn-md btn-danger w-full">
                <i class="ti ti-book-download"></i>
                Clear presets
            </button>

            <button on:click={loadPreset} class="btn-md btn-disabled w-full">
                <i class="ti ti-book-download text-blue-500"></i>
                Load Preset
            </button>

            <input
                class="input-md peer/preset-name"
                bind:value={inputPresetName}
                type="text"
                placeholder="Preset name"
            />
            <button
                on:click={async () => await savePreset(inputPresetName)}
                class="btn-md w-full"
            >
                <i class="ti ti-book-upload text-blue-500"></i>
                Save Preset
            </button>

            <p
                class="text-red-600 col-span-full peer-invalid/preset-name:visible invisible"
            >
                Invalid preset name
            </p>
        </div> -->
        <Dialog.Footer class="grid grid-cols-2 gap-x-3">
            <Label class="text-md row-start-1 mb-2">Nome do preset</Label>
            <Input 
                bind:value={inputPresetName} 
                class="py-6 row-start-2 text-md !ml-0" 
                placeholder="My Preset 001" 
            />

            <Button 
                on:click={async () => await savePreset(inputPresetName)} 
                class="col-start-2 text-md py-6 row-start-2" variant="secondary"
            >
                Save preset
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<!-- <button on:click={() => presetsModal.open()} class="btn-md">
    <i class="ti ti-bookmarks text-blue-500"></i>
    Presets
</button> -->

<!-- <Modal 
    bind:this={presetsModal} 
    title="Presets" 
    let:showDanger 
    bind:showToast={showToast}
>
    
</Modal> -->

<style lang="postcss">
    #presets_header button {
        @apply px-4 py-3 disabled:text-neutral-500 disabled:hover:bg-transparent disabled:cursor-not-allowed;
    }

    .preset_block {
        @apply w-full outline-offset-1 rounded bg-neutral-900 hover:bg-neutral-800 transition-all py-4 border-2 border-transparent;
    }

    .preset_block.selected {
        @apply border-blue-600;
    }
</style>
