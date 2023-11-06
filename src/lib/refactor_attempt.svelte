<script>
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";
    import Modal from "$lib/components/Modal.svelte";
    import OperationBuilder from "$lib/components/OperationBuilder.svelte";
    import Fieldset from "$lib/components/Fieldset.svelte";
    import ToastsWrapper from "$lib/components/ToastsWrapper.svelte";
    import { moveOperation, removeOperation } from "./operationsSystem";
    import { configFlowSystem, addFlow, addOperation, exportFlowsToJson, sendFlowPayload, loadFlow, removeFlow } from "./flowsSystem";

    import { snakeCaseToPascalCase } from "$lib/utils";
    import { onMount } from "svelte";

    let flows = { 
        main_flow: {
            env: {},
            flow: []
        } 
    };
    let addOperationsModal, addFlowModal, payloadModal, pageSettingsModal;
    let toastWrapper;
    let payload = { };
    let newFlowName = '';
    let flowOperationOwner = flows.main_flow;
    let payloadModalTextearea;
    let isFLowAPILoading;
    let runFlowMessage = {
        type: 'error',
        message: ''
    };

    let fieldsetOptions = [ 
        { 
            icon: 'ti-trash',
            action: () => removeFlow(flow_name),
        },
        { 
            icon: 'ti-layout-bottombar-expand',
            action: (_fieldset) => console.log(_fieldset),
        } 
    ];

    // Updates the dropdowns' options dyanmically, as new flows are created
    $: flowsDropdownOptions = Object.keys(flows).map(flow => {
        return {
            label: flow.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
            value: flow
        }
    })

    onMount(() => {
        configFlowSystem(
            flows,
            payload,
            addOperationsModal,
            addFlowModal,
            payloadModal,
            payloadModalTextearea,
            isFLowAPILoading,
            runFlowMessage,
            $FLOW_BUILDER_OPERATION_TEMPLATES,
        );
        
        if (localStorage.getItem('payload')) {
            loadLocalStorage();
            toastWrapper.appendToast('Payload loaded from local storage!', 'success');
        } else {
            toastWrapper.appendToast('No payload found in local storage.', 'error');
        }
    })

    function openAddOperationModal (_flow) {
        flowOperationOwner = _flow;
        addOperationsModal.open();
    }

    // >==================== OPERATIONS SYSTEM ====================< //

    // >==================== FLOWS SYSTEM ====================< //

    // >==================== LOCAL STORAGE SYSTEM ====================< //

    function loadLocalStorage () {
        payload = JSON.parse(localStorage.getItem('payload'));
        Object.entries(payload).forEach(([flow_name, flow_body]) => {
            flows[flow_name] = flow_body;
        })
    }

    function savePayloadToLocalStorage () {
        Object.entries(flows).forEach(([flow_name, flow_body]) => {
            payload[flow_name] = flow_body;
        })
        // payload.main_flow = flows.main_flow;
        localStorage.setItem('payload', JSON.stringify(payload));
        toastWrapper.appendToast('Payload saved!', 'success');
    }

    function clearPayloadLocalStorage () {
        localStorage.removeItem('payload');
        toastWrapper.appendToast('Payload deleted!', 'danger');
        pageSettingsModal.close();
    }
</script>

<svelte:head>
    <title>KMT • Flow Builder</title>
</svelte:head>

<main class="flex flex-col w-[600px]">
    <h2>Flow Builder</h2>

    <div class="grid grid-rows-2 gap-3 grid-cols-2">
        <button on:click={() => pageSettingsModal.open()} class="btn-md btn-full">
            <i class="ti ti-adjustments-horizontal text-blue-500"></i>
            Page Settings
        </button>

        <button on:click={savePayloadToLocalStorage} class="btn-md btn-full">
            <i class="ti ti-device-floppy text-blue-500"></i>
            Save
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
            {#each flows[flow_name].flow as operation, index (operation.id)}
                <OperationBuilder 
                    flowsDropdownOptions={ flowsDropdownOptions }
                    moveOperationUp={() => moveOperation(flows, flow_name, operation, 'up')} 
                    moveOperationDown={() => moveOperation(flows, flow_name, operation, 'down')} 
                    operationStructure={ operation } 
                    removeOperation={() => removeOperation(flows, flow_name, operation.id)}
                />
            {/each}

            <button on:click={() => openAddOperationModal( flow_name )} class="btn-md w-full">
                <i class="ti ti-category-plus text-blue-500"></i>
                Add operation
            </button>
        </Fieldset>
    {/each}

    <button on:click={exportFlowsToJson} class="btn-md btn-full mb-4">
        <i class="ti ti-script text-blue-500"></i>
        Process JSON
    </button>

    <!-- MODAL ADD OPERATION -->

    <Modal bind:this={addOperationsModal} title="Add operation">
        <div class="grid grid-cols-2 gap-x-4 gap-y-2 h-fit">
            {#each Object.keys($FLOW_BUILDER_OPERATION_TEMPLATES) as operationTemplate}
                <button class="btn btn-md w-full" on:click={() => addOperation(flowOperationOwner, operationTemplate )}>
                    <i class={`ti ${ $FLOW_BUILDER_OPERATION_TEMPLATES[operationTemplate].icon || 'ti-topology-ring-2' } text-blue-500 mr-1 text-2xl`}></i>
                    { $FLOW_BUILDER_OPERATION_TEMPLATES[operationTemplate].label }
                </button>
            {/each}
        </div>
    </Modal>

    <!-- MODAL ADD FLOW -->

    <Modal bind:this={addFlowModal} title="Add flow">
        <div class="grid grid-cols-2 gap-3">
            <input class="input input-md col-span-full" type="text" bind:value={newFlowName}>
            <button class="btn btn-md w-full border-neutral-700" on:click={addFlow}>Add</button>
            <button class="btn btn-md w-full border-neutral-700" on:click={() => addFlowModal.close()}>Cancel</button>
        </div>
    </Modal>

    <!-- MODAL RUN FLOW -->

    <Modal bind:this={payloadModal} title="Payload" on:close={() => runFlowMessage.message = ''}>
        <textarea bind:value={payloadModalTextearea} name="" id="" cols="30" rows="20"></textarea>
        
        {#if runFlowMessage.message !== ''}
            <span class={`${ runFlowMessage.type === 'error' ? 'text-red-600' : 'text-green-600' } mt-4`}>
                    <i class="ti ti-exclamation-circle text-lg mr-2 align-middle"></i>
                    { runFlowMessage.message }
            </span>
        {/if}

        <div class="grid grid-cols-2 gap-x-3">
            <button disabled={isFLowAPILoading} on:click={async () => await sendFlowPayload()} class="btn-md w-full mt-4">
                {#if isFLowAPILoading}
                    <span class="w-full inline-flex justify-center">
                        <i class="ti ti-loader-2 text-neutral-400 animate-spin-icon"></i>
                    </span>
                {:else }
                    <i class="ti ti-arrows-split-2 text-blue-500"></i>
                    Run flow
                {/if}
            </button>
    
            <button on:click={loadFlow} class="btn-md w-full mt-4">
                <i class="ti ti-file-upload text-blue-500"></i>
                Load Flows
            </button>
        </div>
    </Modal>

    <Modal bind:this={pageSettingsModal} title="Page Settings">
        <button on:click={clearPayloadLocalStorage} class="btn-sm">Clear Local Storage</button>
    </Modal>

    <ToastsWrapper bind:this={toastWrapper} />
</main>