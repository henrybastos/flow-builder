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
    import Modal from "$lib/components/Modal.svelte";
    import PresetsModal from '$lib/components/PresetsModal.svelte';
    import OperationBuilder from "$lib/components/OperationBuilder.svelte";
    import Fieldset from "$lib/components/Fieldset.svelte";
    import ToastsWrapper from "$lib/components/ToastsWrapper.svelte";

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

        if (localStorage.getItem('presets')) {
            presets = JSON.parse(localStorage.getItem('presets'));
            console.log(JSON.stringify(presets, null, 3));
        }
    })

    function savePreset () {
        localStorage.setItem('presets', JSON.stringify({...presets, [newPresetName]: { payload } }));
        console.log('Preset saved!');
    }

    function clearPresets () {
        localStorage.removeItem('presets');
        console.log('Presets cleared!');
    }

    function removePreset (_preset_name) {
        delete presets[_preset_name];
        localStorage.setItem('presets', JSON.stringify(presets));
    }

    function loadPreset (_preset_name) {
        console.log(_preset_name, presets[_preset_name].payload);
        payloadModalTextearea = JSON.stringify(presets[_preset_name].payload, null, 3);
        loadPayload();
        presetsModal.close();
    }

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

    async function exportFlowsToJson () {
        Object.entries(flows).forEach(([flow_name, flow_body]) => {
            let flowBuffer = [];

            for (let block of flow_body) {
                let commandBody = {};
                commandBody.command = block.command;

                if (block?.input_fields) {
                    Object.entries(block.input_fields).forEach(([field_name, field]) => {
                        commandBody[field_name] = field.value;
                    })
                }

                flowBuffer.push(commandBody);
            }
            payload.flows[flow_name] = flowBuffer;
        });
    }

    function openPresetsModal () {
        exportFlowsToJson();
        presetsModal.open();
    }

    function openPayloadModal () {
        exportFlowsToJson();
        payloadModalTextearea = JSON.stringify(payload, null, 3);
        payloadModal.open();
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

    <div class="btn-bar">
        <button on:click={openPresetsModal} class="btn-md w-full col-span-full">
            <i class="ti ti-bookmarks text-blue-500"></i>
            Presets
        </button>

        <button on:click={() => pageSettingsModal.open()} class="btn-md btn-full col-span-full">
            <i class="ti ti-adjustments-horizontal text-blue-500"></i>
            Page Settings
        </button>
    
        <button on:click={() => addFlowModal.open()} class="btn-md w-full col-span-full">
            <i class="ti ti-s-turn-right text-blue-500"></i>
            Add flow
        </button>
    </div>

    {#each Object.keys(flows) as flow_name, index (flow_name)}
        <Fieldset 
            legend={ snakeCaseToPascalCase(flow_name, true) } 
            isDynamic={flow_name !== 'main_flow' ? true : false} 
            options={fieldsetOptions}
        >
            {#each flows[flow_name] as operation, index (operation.id)}
                <OperationBuilder 
                    flowsDropdownOptions={ flowsDropdownOptions }
                    moveOperationUp={() => moveOperation(flow_name, operation, 'up')} 
                    moveOperationDown={() => moveOperation(flow_name, operation, 'down')} 
                    operationStructure={ operation } 
                    removeOperation={() => removeOperation(flow_name, operation.id)}
                />
            {/each}

            <button on:click={() => openAddOperationModal( flow_name )} class="btn-md w-full">
                <i class="ti ti-category-plus text-blue-500"></i>
                Add operation
            </button>
        </Fieldset>
    {/each}

    <button on:click={openPayloadModal} class="btn-md btn-full mb-4">
        <i class="ti ti-script text-blue-500"></i>
        Process JSON
    </button>

    <Modal bind:this={addOperationsModal} title="Add operation">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 h-fit">
            {#each Object.keys($FLOW_BUILDER_OPERATION_TEMPLATES) as operationTemplate}
                <button class="btn btn-md w-full" on:click={() => addFlowOperation( operationTemplate )}>
                    <i class={`ti ${ $FLOW_BUILDER_OPERATION_TEMPLATES[operationTemplate].icon || 'ti-topology-ring-2' } text-blue-500 mr-1 text-2xl`}></i>
                    { $FLOW_BUILDER_OPERATION_TEMPLATES[operationTemplate].label }
                </button>
            {/each}
        </div>
    </Modal>

    <Modal bind:this={addFlowModal} title="Add flow">
        <div class="btn-bar">
            <input class="input input-md col-span-full" type="text" bind:value={newFlowName}>
            <button class="btn btn-md w-full border-neutral-700" on:click={addFlow}>Add</button>
            <button class="btn btn-md w-full border-neutral-700" on:click={() => addFlowModal.close()}>Cancel</button>
        </div>
    </Modal>

    <Modal bind:this={payloadModal} title="Payload" on:close={() => runFlowMessage.message = ''}>
        <textarea class="code" bind:value={payloadModalTextearea} name="" id="" cols="30" rows="20"></textarea>
        
        {#if runFlowMessage.message !== ''}
            <span class={`${ runFlowMessage.type === 'error' ? 'text-red-600' : 'text-green-600' } mt-4`}>
                    <i class="ti ti-exclamation-circle text-lg mr-2 align-middle"></i>
                    { runFlowMessage.message }
            </span>
        {/if}

        <div class="btn-bar">
            <button disabled={isFLowAPILoading} on:click={async () => await sendFlowPayload(payload)} class="btn-md w-full mt-4">
                {#if isFLowAPILoading}
                    <span class="w-full inline-flex justify-center">
                        <i class="ti ti-loader-2 text-neutral-400 animate-spin-icon"></i>
                    </span>
                {:else }
                    <i class="ti ti-arrows-split-2 text-blue-500"></i>
                    Run flow
                {/if}
            </button>
    
            <button on:click={loadPayload} class="btn-md w-full mt-4">
                <i class="ti ti-file-upload text-blue-500"></i>
                Load payload
            </button>
        </div>
    </Modal>

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

    <PresetsModal />

    <ToastsWrapper bind:this={toastWrapper} />
</main>