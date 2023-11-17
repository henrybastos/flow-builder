<script>
    import '../app.postcss';
    import { PAYLOAD } from "$lib/PayloadStore";

    import PageSettings from '$lib/components/PageSettings.svelte';
    import PresetsModal from '$lib/components/PresetsModal.svelte';
    import PayloadModal from '$lib/components/PayloadModal.svelte';
    import AddFlowModal from '$lib/components/AddFlowModal.svelte';
    import ToastsWrapper from "$lib/components/ToastsWrapper.svelte";
    import Flow from '$lib/components/Flow.svelte';
    import { onMount } from 'svelte';
    import { FLOW_PRESETS } from '$lib/PresetsStore';

    let appendToast;

    function checkAndLoadTempPreset () {
        if (localStorage?.getItem('temp_preset')) {
            PAYLOAD.loadPayload(JSON.parse(localStorage.getItem('temp_preset')));
        }
    }

    function checkAndLoadPresets () {
        if (localStorage?.getItem('presets')) {
            try {
                FLOW_PRESETS.loadPresets(JSON.parse(localStorage.getItem('presets')));
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

    onMount(() => {
        checkAndLoadTempPreset();
        checkAndLoadPresets();
    });
</script>


<!-- ============================== -->


<svelte:head>
    <title>KMT • Flow Builder</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</svelte:head>

<header class="fixed flex flex-row justify-between items-center py-3 px-4 w-full bg-neutral-900">
    <h3>Flow Builder</h3>

    <div>
        <PresetsModal {appendToast}/>
    
        <PageSettings {appendToast}/>
        
        <AddFlowModal />

        <PayloadModal />
    </div>
</header>

<main class="flex flex-col w-[50rem] mt-24">
    {#each Object.keys($PAYLOAD.flows) as flow_name}
        <Flow flowName={flow_name} />
    {/each}
    
    <ToastsWrapper bind:appendToast={appendToast}/>
    <p class="text-center text-neutral-500 mb-4">Powered by Tailwind, SvelteKit and Puppeteer</p>
</main>