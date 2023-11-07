<script>
    import Dropdown from "./Dropdown.svelte";
    import { getContext } from "svelte";
    import { FLOW_BUILDER_INPUT_FIELD_TEMPLATES } from "$lib/store";
    import PAYLOAD from "$lib/PayloadStore";
    import { snakeCaseToPascalCase, checkForEnvPlaceholder } from "$lib/utils";

    let isOptionnCollapsed = true;
    let flowName = getContext('flow_name');

    export let operation;
    export let flowsDropdownOptions = [
        { label: 'flow_01', value: 'Flow 01' },
        { label: 'flow_02', value: 'Flow 02' }
    ];

    const OPERATION_CONFIG_OPTIONS = [
        {
            name: 'remove',
            danger: true,
            icon: 'ti-trash',
            action: () => PAYLOAD.removeOperation(flowName, operation.id)
        },
        {
            name: 'move_up',
            icon: 'ti-circle-chevron-up',
            action: () => PAYLOAD.moveOperation(flowName, operation, 'up')
        },
        {
            name: 'move_down',
            icon: 'ti-circle-chevron-down',
            action: () => PAYLOAD.moveOperation(flowName, operation, 'down')
        }
    ];

    function handleDropdownOptionSelection ({ detail }, _field) {
        if (operation.command === 'repeat_flow') {
            _field.value = detail.value;
            _field.dropdown_label = detail.label;

            switch (detail.value) {
                case 'by_group':
                    operation.input_fields.group_name = FLOW_BUILDER_INPUT_FIELD_TEMPLATES.group_name; 
                    delete operation.input_fields.flow;
                    break;
                case 'by_flow':
                    operation.input_fields.flow = FLOW_BUILDER_INPUT_FIELD_TEMPLATES.flow; 
                    delete operation.input_fields.group_name;
                    break;
            }
        }
    }

    function isFlowsDropdown (field_name) {
        const knownDropdownFieldNames = ['flow', 'error_flow', 'success_flow'];
        return knownDropdownFieldNames.includes(field_name);
    }
</script>

<div class="mb-4 p-4 border-2 border-neutral-800 rounded-lg" id={ operation.id }>
    <div class="flex flex-row justify-between">
        <h5 class="mb-4 text-left">
            <i class={`ti ${ operation.icon || 'ti-topology-ring-2' } text-blue-500 mr-1 text-2xl`}></i>
            { operation.label }
        </h5>
        <div class="flex flex-row flex-nowrap">
            <i on:click={() => isOptionnCollapsed = !isOptionnCollapsed} class="ti ti-settings text-2xl text-neutral-600 hover:text-neutral-200 cursor-pointer"></i>
            <div class={`flex flex-row overflow-hidden ${ isOptionnCollapsed ? 'max-w-0' : 'max-w-7xl' }`}>
                <p class="ml-2 text-neutral-700 text-2xl">|</p>
                {#each OPERATION_CONFIG_OPTIONS as option}
                    <i class={`ti ${ option.icon } text-2xl ${ option.danger ? 'hover:text-red-500' : 'hover:text-neutral-300' }  text-neutral-500  cursor-pointer ml-2`} on:click={ option.action }></i>
                {/each}
            </div>
        </div>
    </div>
    <div class="grid grid-cols-[min-content_auto] gap-y-3">
        {#if operation?.input_fields}
            {#each Object.entries(operation.input_fields) as [field_name, field], i (operation.id)}
                {#if field.type !== 'btn'}
                    <label class="col-start-1 col-end-2 whitespace-nowrap pr-4 my-auto" for={ field_name }>{ field.label }</label>
                {/if}

                {#if field.type === 'text'}
                    <input 
                        class={`col-start-2 input-md ${ checkForEnvPlaceholder(field.value) ? 'font-code text-green-600' : 'font-sans' }`} 
                        bind:value={ field.value } 
                        id={ field_name } 
                        type="text" 
                        placeholder={ field.placeholder }
                    >
                {:else if field.type === 'dropdown'}
                {:else if field.type === 'btn'}
                    <button class="btn-sm col-span-full w-full">{ field.label }</button>
                {/if}
            {/each}
        {:else}
            <p class="col-span-full text-neutral-500">No inputs required :D</p>
        {/if}

    </div>
</div>