<!-- 
██████   █████   ██████  ███████     ███████  ██████ ██████  ██ ██████  ████████ 
██   ██ ██   ██ ██       ██          ██      ██      ██   ██ ██ ██   ██    ██    
██████  ███████ ██   ███ █████       ███████ ██      ██████  ██ ██████     ██    
██      ██   ██ ██    ██ ██               ██ ██      ██   ██ ██ ██         ██    
██      ██   ██  ██████  ███████     ███████  ██████ ██   ██ ██ ██         ██     
-->



<script>
    import '../app.css';
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";
    import PAYLOAD from "$lib/PayloadStore";

    import Modal from "$lib/components/Modal.svelte";
    import PresetsModal from '$lib/components/PresetsModal.svelte';
    import PayloadModal from '$lib/components/PayloadModal.svelte';
    import AddFlowModal from '$lib/components/AddFlowModal.svelte';
    import OperationBuilder from "$lib/components/OperationBuilder.svelte";
    import Fieldset from "$lib/components/Fieldset.svelte";
    import ToastsWrapper from "$lib/components/ToastsWrapper.svelte";
    import LetTest from '$lib/components/LetTest.svelte';
    import Flow from '$lib/components/Flow.svelte';

    import { snakeCaseToPascalCase, convertToSnakeCase } from "$lib/utils";
    import { onMount } from "svelte";

    let flows = { 
        main_flow: []
    };
    let addOperationsModal, addFlowModal, payloadModal, pageSettingsModal, presetsModal;
    let toastWrapper;
    let payload = { 
        env: {},
        flows: {}
    };
    let newFlowName = '';
    let newPresetName;
    let flowOperationOwner = flows.main_flow;
    let payloadModalTextearea;

    let presets = {};

    let fieldsetOptions = [ 
        { 
            icon: 'ti-trash',
            action: () => removeFlow(flow_name),
        },
        { 
            icon: 'ti-layout-bottombar-expand',
            action: (_fieldset) => console.log(_fieldset),
        } 
    ]

    // Updates the dropdowns' options dyanmically, as new flows are created
    $: flowsDropdownOptions = Object.keys(flows).map(flow => {
        return {
            label: flow.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            value: flow
        }
    })

    onMount(() => {
        if (localStorage.getItem('payload')) {
            payload = JSON.parse(localStorage.getItem('payload'));

            Object.entries(payload.flows).forEach(([flow_name, flow_body]) => {
                flows[flow_name] = flow_body;
            })
            toastWrapper.appendToast('Payload loaded from local storage!', 'success');
        } else {
            toastWrapper.appendToast('No payload found in local storage.', 'error');
        }

        if (localStorage?.getItem('presets')) {
            try {
                presets = JSON.parse(localStorage.getItem('presets'));
            } catch (err) {
                console.error(err);
                console.error(`[ERR] Invalid presets strucuture.`);
            }
        }

        // FLOW_PRESETS.savePreset({ preset_01: { command: 'test' }});

        // console.log($FLOW_PRESETS);
    });

    function removeFlow (_flow_name) {
        if (_flow_name !== 'main_flow') {
            delete flows[_flow_name];
        }

        flows = flows;
    }

    function savePayloadToLocalStorage () {
        Object.entries(flows).forEach(([flow_name, flow_body]) => {
            payload.flows[flow_name] = flow_body;
        })
        // payload.main_flow = flows.main_flow;
        localStorage.setItem('payload', JSON.stringify(payload));
        pageSettingsModal.close();
        toastWrapper.appendToast('Payload saved!', 'success');
    }

    function clearPayloadLocalStorage () {
        localStorage.removeItem('payload');
        toastWrapper.appendToast('Payload deleted!', 'danger');
        pageSettingsModal.close();
    }

    let id_arr = [
        'id_001',
        'id_002'
    ]
</script>


<!-- 
██████   █████   ██████  ███████     ██   ██ ████████ ███    ███ ██      
██   ██ ██   ██ ██       ██          ██   ██    ██    ████  ████ ██      
██████  ███████ ██   ███ █████       ███████    ██    ██ ████ ██ ██      
██      ██   ██ ██    ██ ██          ██   ██    ██    ██  ██  ██ ██      
██      ██   ██  ██████  ███████     ██   ██    ██    ██      ██ ███████ 
-->
                                                                         

<svelte:head>
    <title>KMT • Flow Builder</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</svelte:head>

<main class="flex flex-col w-[600px]">
    <header class="flex flex-col my-10">
        <h2 class="m-0">Flow Builder</h2>
        <p class="text-center text-neutral-500">Powered by Tailwind, SvelteKit and Puppeteer</p>
    </header>

    <!-- {#each id_arr as item_id}
        <LetTest let:sayId id={item_id}>
            <button class="btn-md" on:click={sayId}>Bark 🐶</button>
        </LetTest>
    {/each} -->

    <div class="btn-bar">
        <button on:click={() => presetsModal.open()} class="btn-md w-full col-span-full">
            <i class="ti ti-bookmarks text-blue-500"></i>
            Presets
        </button>

        <button on:click={() => pageSettingsModal.open()} class="btn-md btn-full col-span-full">
            <i class="ti ti-adjustments-horizontal text-blue-500"></i>
            Page Settings
        </button>
        <AddFlowModal />
    </div>

    {#each Object.keys($PAYLOAD.flows) as flow_name}
        <Flow flowName={flow_name} />
    {/each}

    <PayloadModal />

    <Modal bind:this={pageSettingsModal} title="Page Settings">
        <div class="btn-bar">
            <button on:click={clearPayloadLocalStorage} class="btn-sm btn-danger w-full">
                <i class="ti ti-database-x"></i>
                Clear Local Storage
            </button>

            <button on:click={savePayloadToLocalStorage} class="btn-sm btn-full">
                <i class="ti ti-device-floppy text-blue-500"></i>
                Save to Local Storage
            </button>
        </div>
    </Modal>

    <PresetsModal bind:presetsModal={presetsModal}/>

    <ToastsWrapper bind:this={toastWrapper} />
</main>