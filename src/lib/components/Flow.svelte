<script>
    import Fieldset from "./Fieldset.svelte";
    import OperationBuilder from "./OperationBuilder.svelte";
    import Modal from "./Modal.svelte";
    import PAYLOAD from "$lib/PayloadStore";
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";

    import { snakeCaseToPascalCase } from "$lib/utils";
    import { getOperationIndex } from "$lib/operationsSystem";
    import { setContext } from "svelte";

    let addOperationsModal;

    export let flowName;

    
    function addOp (_flow_name, _operation) {
        PAYLOAD.addCommand(_flow_name, _operation);
        // console.log(JSON.stringify($PAYLOAD, null, 3));
        addOperationsModal.close();
    }

    const FIELDSET_OPTIONS = [ 
        { 
            icon: 'ti-trash',
            action: () => removeFlow(flow_name),
        },
        { 
            icon: 'ti-layout-bottombar-expand',
            action: (_fieldset) => console.log(_fieldset),
        } 
    ]

    setContext('flow_name', flowName);
</script>

<Fieldset 
    legend={ snakeCaseToPascalCase(flowName, true) } 
    isDynamic={flowName !== 'main_flow' ? true : false} 
    options={FIELDSET_OPTIONS}
>
    {#each Object.values($PAYLOAD.flows[flowName]) as operation, index (operation.id)}
        <OperationBuilder {operation} flowsDropdownOptions={ [{ label: 'flow_01', value: 'Flow 01' }] } />
    {/each}

    <button on:click={() => addOperationsModal.open()} class="btn-md w-full">
        <i class="ti ti-category-plus text-blue-500"></i>
        Add operation
    </button>
</Fieldset>

<Modal bind:this={addOperationsModal} title="Add operation">
    <div class="grid grid-cols-2 gap-x-4 gap-y-2 h-fit">
        {#each Object.values($FLOW_BUILDER_OPERATION_TEMPLATES) as operationTemplate}
            <button class="btn btn-md w-full" on:click={() => addOp(flowName, structuredClone(operationTemplate))}>
                <i class={`ti ${ operationTemplate.icon || 'ti-topology-ring-2' } text-blue-500 mr-1 text-2xl`}></i>
                { operationTemplate.label }
            </button>
        {/each}
    </div>
</Modal>