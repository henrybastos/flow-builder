<script>
    import Fieldset from "../components/Fieldset.svelte";
    import OperationBuilder from "./OperationBuilder.svelte";
    import Modal from "../components/Modal.svelte";
    import { PAYLOAD } from "$lib/PayloadStore";
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/OperationTemplates";

    import { snakeCaseToPascalCase } from "$lib/utils";

    let addOperationsModal;
    let showDanger;
    let operationsLimit = 5;

    export let flowName;
    // To collapse Fieldsets when preset is loaded
    // export let loadedPresetName;

    function addOp (_flow_name, _operation) {
        PAYLOAD.addOperation(_flow_name, _operation);
        // console.log(JSON.stringify($PAYLOAD, null, 3));
        addOperationsModal.close();
    }

    function isMainFlow (_flow_name) {
        return _flow_name === 'main_flow'
    }

    const removeFieldset = {
        icon: 'ti-trash',
        danger: true,
        action: () => showDanger(() => PAYLOAD.removeFlow(flowName), { danger_modal_title: `Remove flow ${ flowName }?` })
    }

    $: hasFieldsetReachedOperationsLimit = Object.values($PAYLOAD.flows[flowName]).length > operationsLimit;
</script>

<!-- isFieldsetCollapsed is set to true (collapsed) only if the flow is not the Main Flow and the flow is not empty. -->

<Fieldset 
    isFieldsetCollapsed={ hasFieldsetReachedOperationsLimit }
    legend={ snakeCaseToPascalCase(flowName, true) } 
    isDynamic={ !isMainFlow(flowName) }
    extraOptions={{removeFieldset}}
    fieldsetCollapsedPlaceholder={`${ Object.values($PAYLOAD.flows[flowName]).length } operations...`}
    class={isMainFlow(flowName) ? $PAYLOAD?.config?.ws_endpoint ? 'border-green-500' : 'border-blue-500' : ''}
>
    {#each Object.values($PAYLOAD.flows[flowName]) as operation, index (operation.id)}
        <OperationBuilder {flowName} {operation} flowsDropdownOptions={ [{ label: 'flow_01', value: 'Flow 01' }] } />
    {/each}

    <button on:click={() => addOperationsModal.open()} class="btn-md w-full">
        <i class="ti ti-category-plus text-blue-500"></i>
        Add operation
    </button>
</Fieldset>

<Modal bind:this={addOperationsModal} title="Add operation" bind:showDanger>
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 max-h-[40rem] overflow-y-auto">
        {#each Object.values(FLOW_BUILDER_OPERATION_TEMPLATES) as operationTemplate}
            {#if !operationTemplate.disabled}                
                <button class="btn btn-md w-full" on:click={() => addOp(flowName, structuredClone(operationTemplate))}>
                    <i class={`ti ${ operationTemplate.icon || 'ti-topology-ring-2' } text-blue-500 mr-1 text-2xl`}></i>
                    { operationTemplate.label }
                </button>
            {/if}
        {/each}
    </div>
</Modal>