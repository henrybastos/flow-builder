<script>
    /**========================================================================
     * ?                                ABOUT
     * @author         :  Henry B. Silva
     * @repo           :  https://github.com/henrybastos/flow-builder.git
     * @description    :  The main page for Flow Builder
     *========================================================================**/

    import '../app.postcss';
    import { onMount, setContext } from 'svelte';
    import { PAYLOAD } from "$lib/PayloadStore";
    import { FLOW_PRESETS } from '$lib/PresetsStore';
    import PageSettings from '$lib/modules/PageSettings.svelte';
    import PresetsModal from '$lib/modules/PresetsModal.svelte';
    import PayloadModal from '$lib/modules/PayloadModal/PayloadModal.svelte';
    import AddFlowModal from '$lib/modules/AddFlowModal.svelte';
    import ToastsWrapper from "$lib/components/ToastsWrapper.svelte";
    import UpdateCurrentPresetModal from '$lib/modules/UpdateCurrentPresetModal.svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
    import Flow from '$lib/modules/Flow.svelte';
    import { CURRENT_PRESET_NAME } from '$lib/PresetsStore';
    import { transformToJSON } from '$lib/utils';
    import { Button } from '$lib/components/ui/button';
    import { VERSION } from '$lib/store';
    import FlowBlocks from '$lib/modules/FlowBlocks.svelte';
    import { toast } from 'svelte-sonner';

    // import Button from '$lib/components/ui/button/button.svelte';
    // import { toggleMode } from 'mode-watcher';
    
    let showGlobalToast;
    let loadedPresetName = '';
    let pageSettingsWSEndpoint;
    let payloadModalTextearea;

    function checkAndLoadTempPreset () {
        if (localStorage?.getItem('temp_preset')) {
            PAYLOAD.loadPayload(JSON.parse(localStorage.getItem('temp_preset')));
        }
    }

    async function loadAllPresetsFromLibrary () {
        const ALL_PRESETS = await FLOW_PRESETS.loadAllPresetsFromLibrary();

        for(const [preset_name, preset_payload] of Object.entries(ALL_PRESETS)) {
            FLOW_PRESETS.savePreset({ [preset_name.match(/[^\s].*(?=\.json)/g)]: { ...preset_payload }});
        }

        $FLOW_PRESETS = $FLOW_PRESETS;
    }

    function checkAndLoadPresets () {
        if (localStorage?.getItem('presets')) {
            try {
                // FLOW_PRESETS.loadPresets(JSON.parse(localStorage.getItem('presets')));
                showGlobalToast('Presets loaded successfully!', 'success');
            } catch (err) {
                console.error(err);
                console.error(`[ERR] Invalid presets strucuture.`);
                showGlobalToast('[ERR] Invalid presets strucuture.', 'error');
            }
        } else {
            showGlobalToast('No presets found :(', 'error');
        }
    }

    function onPresetLoadedHandler ({ detail }) {
        loadedPresetName = detail.presetName;
        pageSettingsWSEndpoint = '';
        console.log(detail.presetBody);
        payloadModalTextearea = transformToJSON(detail.presetBody);
        console.log(detail);
    }

    /**
     * Loads a default payload code to the Code Mirror editor.
     */
    function loadDefaultPayload () {
        console.log('Default payload loaded');
        payloadModalTextearea = `${ transformToJSON($PAYLOAD) }\n\n\n\n\n\n\n\n\n\n\n\n\n\n`;
    }

    function loadBlankPayload () {
        PAYLOAD.loadBlankPayload();
        payloadModalTextearea = `${ transformToJSON($PAYLOAD) }\n\n\n\n\n\n\n\n\n\n\n\n\n\n`;
        console.log('Blank payload loaded');
    }
    
    function onPayloadModalOpen() {
        loadDefaultPayload();
        // codeMirrorValue = transformToJSON($PAYLOAD);
        // codeMirrorValue = 'var 1 = "Hello!;"';
    }

    setContext('loadAllPresetsFromLibrary', loadAllPresetsFromLibrary);

    onMount(async () => {
        await loadAllPresetsFromLibrary();
        checkAndLoadTempPreset();
        checkAndLoadPresets();
    });
</script>

<svelte:head>
    <title>Flow Builder</title>
</svelte:head>

<header class="fixed w-full bg-neutral-900">
    <div class="flex flex-row justify-between items-center py-3 px-4 w-full">
        <!-- <h3>Flow Builder</h3> -->
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild let:builder>
                <Button builders={[builder]} variant="ghost" size="icon">
                    <i class="ti ti-menu-2"></i>
                </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content class="w-[16rem]">
                <DropdownMenu.Label>Flow Builder</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                    <DropdownMenu.Item on:click={loadBlankPayload}>
                        <i class="ti ti-file mr-2"></i>
                        <span>New flow</span>
                    </DropdownMenu.Item>
                </DropdownMenu.Group>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    
        <div class="inline-flex gap-x-2 items-center">
            <FlowBlocks {toast} />

            <PresetsModal on:preset_loaded={onPresetLoadedHandler} {showGlobalToast}/>

            {#if $CURRENT_PRESET_NAME}
                <UpdateCurrentPresetModal />
            {/if}
        
            <PageSettings bind:wsEndpoint={pageSettingsWSEndpoint} {showGlobalToast}/>
            
            <AddFlowModal />
    
            <PayloadModal on:open={onPayloadModalOpen} bind:payloadModalTextearea={payloadModalTextearea} {showGlobalToast} />

            <!-- <Button on:click={toggleMode} variant="outline" size="icon">
                <i class="ti ti-moon h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"></i>
                <i class="ti ti-sun absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"></i>
                <span class="sr-only">Toggle theme</span>
            </Button> -->
        </div>
    </div>

    <span class={`flex w-full px-2 py-1 font-normal bg-green-600 ${ $PAYLOAD.config.ws_endpoint ? 'visible h-min' : 'invisible h-0' }`}>
        Web Socket connected at { $PAYLOAD.config.ws_endpoint }
    </span>
</header>

<main class="flex flex-col w-[50rem] mt-28">
    {#each Object.keys($PAYLOAD.flows) as flow_name}
        <Flow {loadedPresetName} flowName={flow_name} />
    {/each}
    
    <ToastsWrapper bind:showGlobalToast={showGlobalToast}/>
    <p class="text-center text-neutral-500 mb-4">Powered by Tailwind, SvelteKit and Puppeteer • { VERSION }</p>
</main>