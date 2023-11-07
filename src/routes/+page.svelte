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
    let isFLowAPILoading;
    let runFlowMessage = {
        type: 'error',
        message: ''
    };

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

    function addFlow () {
        flows[convertToSnakeCase(newFlowName)] = [];
        newFlowName = '';
        addFlowModal.close();
    }

    function openAddOperationModal (_flow) {
        flowOperationOwner = _flow;
        addOperationsModal.open();
    }

    function addFlowOperation (_operation_command) {
        let newOperationBody = structuredClone($FLOW_BUILDER_OPERATION_TEMPLATES[_operation_command]);
        newOperationBody.id = Math.random().toString().slice(2);

        if (newOperationBody?.input_fields) {
            Object.entries(newOperationBody.input_fields).forEach(([input_name, input]) => {
                if (input.type === 'dropdown' && input_name === 'flow') {
                    input.options = Object.keys(flows);
                }
            })
        }
        
        flows[flowOperationOwner] = [...flows[flowOperationOwner], newOperationBody];
        addOperationsModal.close();
    }

    function addFlowOperationBody (_operation_body, _flow_name) {
        if (_operation_body?.input_fields) {
            Object.values(_operation_body.input_fields).forEach(input => {
                if (input.type === 'dropdown') {
                    input.options = Object.keys(flows);
                }
            })
        }
            
            if (flows[_flow_name]) {
                flows[_flow_name] = [...flows[_flow_name], _operation_body];
            } else {
                flows[_flow_name] = [_operation_body];
            }

            addOperationsModal.close();
    }
    
    async function sendFlowPayload (_payload) {
        isFLowAPILoading = true;

        if (_payload.flows.main_flow.length > 0) {
            let response = await fetch('http://localhost:5173/api/run-flow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( _payload )
            });

            response = await response.json();
            if (response.error) {
                runFlowMessage.type = 'error';
                runFlowMessage.message = response.error.message;
            } else {
                console.log(response);
                runFlowMessage.type = 'success';
                runFlowMessage.message = response.status.message;
            }
        } else {
            runFlowMessage.type = 'error';
            runFlowMessage.message = 'Empty Main Flow. Nothing to run.';
        }
        isFLowAPILoading = false;
    }

    function moveOperation (_flow_key, _op, _direction) {
        const currentFlow = flows[_flow_key];
        const [currentOperationIndex] = getOperationIndex(currentFlow, _op.id);
        
        
        if (_direction === 'down') {
            if (currentOperationIndex < currentFlow.length) {
                // Ads operation after it's own index
                currentFlow.splice(currentOperationIndex + 2, 0, _op);
                // Removes it's own old copy
                currentFlow.splice(currentOperationIndex, 1);
            }
        } else if (_direction === 'up') {
            if (currentOperationIndex !== 0) {
                // Ads operation before it's own index
                currentFlow.splice(currentOperationIndex - 1, 0, _op);
                // Removes it's own old copy
                currentFlow.splice(currentOperationIndex + 1, 1);
            }
        }

        // Updates the DOM
        flows[_flow_key] = flows[_flow_key];
    }

    function getOperationIndex (_flow, _op_id) {
        return Object.keys(_flow).map((op, index) => {
            if (_flow[op].id === _op_id) {
                return index;
            };
        }).filter(v => v !== undefined);
    }

    function loadPayload () {
        const payloadJSON = JSON.parse(payloadModalTextearea);

        payload = {
            env: {},
            flows: {}
        }

        flows = [];

        payload.env = payloadJSON.env;

        Object.entries(payloadJSON.flows).forEach(([ flow_name, flow_body ]) => {
            Object.values(flow_body).forEach((operation) => {
                if ( $FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] ) {
                    const operationBody = structuredClone( $FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] );
                    
                    if (operationBody?.input_fields) {
                        Object.entries(operationBody.input_fields).forEach(([key, value]) => {
                            value.value = operation[key];
                        })
                    }
        
                    operationBody.id = Math.random().toString().slice(2);
                    addFlowOperationBody(operationBody, flow_name);
                }
            })
        });

        payloadModal.close();
    }

    function removeOperation (_flow_name, _id) {
        Object.entries(flows[_flow_name]).forEach(([ index, operation ]) => {
            if (_id === operation.id) {
                flows[_flow_name].splice(index, 1);
            }
        });

        // Updates the DOM
        flows[_flow_name] = flows[_flow_name];
    }

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

    <!-- START  //  OPERATION SECTION   //  START -->
    {#each Object.keys($PAYLOAD.flows) as flow_name}
        {#if flow_name !== 'env'}   
            <Flow flowName={flow_name} />
        {/if}
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