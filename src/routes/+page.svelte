<script>
    import '../app.postcss';
    import { onMount } from 'svelte';
    import { PAYLOAD } from "$lib/PayloadStore";
    import PageSettings from '$lib/modules/PageSettings.svelte';
    import PresetsModal from '$lib/modules/PresetsModal.svelte';
    import PayloadModal from '$lib/modules/PayloadModal/PayloadModal.svelte';
    import AddFlowModal from '$lib/modules/AddFlowModal.svelte';
    import ToastsWrapper from "$lib/components/ToastsWrapper.svelte";
    import UpdateCurrentPresetModal from '$lib/modules/UpdateCurrentPresetModal.svelte';
    import Flow from '$lib/modules/Flow.svelte';
    import { CURRENT_PRESET_NAME } from '$lib/PresetsStore';

    let appendToast;
    let loadedPresetName = '';
    let pageSettingsWSEndpoint;

    function checkAndLoadTempPreset () {
        if (localStorage?.getItem('temp_preset')) {
            PAYLOAD.loadPayload(JSON.parse(localStorage.getItem('temp_preset')));
        }
    }

    function checkAndLoadPresets () {
        if (localStorage?.getItem('presets')) {
            try {
                // FLOW_PRESETS.loadPresets(JSON.parse(localStorage.getItem('presets')));
                appendToast('Presets loaded successfully!', 'success');
            } catch (err) {
                console.error(err);
                console.error(`[ERR] Invalid presets strucuture.`);
                appendToast('[ERR] Invalid presets strucuture.', 'error');
            }
        } else {
            appendToast('No presets found :(', 'error');
        }
    }

    function onPresetLoadedHandler ({ detail }) {
        loadedPresetName = detail.presetName;
        pageSettingsWSEndpoint = '';
    }

    onMount(() => {
        checkAndLoadTempPreset();
        checkAndLoadPresets();
    });
</script>

<svelte:head>
    <title>Flow Builder</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</svelte:head>

<header class="fixed w-full bg-neutral-900">
    <div class="flex flex-row justify-between items-center py-3 px-4 w-full">
        <h3>Flow Builder</h3>
    
        <div class="inline-flex gap-x-2">
            <PresetsModal on:preset_loaded={onPresetLoadedHandler} {appendToast}/>

            {#if $CURRENT_PRESET_NAME}
                <UpdateCurrentPresetModal />
            {/if}
        
            <PageSettings bind:wsEndpoint={pageSettingsWSEndpoint} {appendToast}/>
            
            <AddFlowModal />
    
            <PayloadModal />

            <!-- <button 
                class="bg-transparent border-none p-3" 
                on:click={async () => await FLOW_PRESETS.loadAllPresetsFromLibrary()}
            >
                Load all presets
            </button> -->
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
    
    <ToastsWrapper bind:appendToast={appendToast}/>
    <p class="text-center text-neutral-500 mb-4">Powered by Tailwind, SvelteKit and Puppeteer</p>
</main>

