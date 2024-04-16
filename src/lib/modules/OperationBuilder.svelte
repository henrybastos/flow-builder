<script>
    import Dropdown from "../components/Dropdown.svelte";
    import CollapsableOptions from "../components/CollapsableOptions.svelte";
    import { PAYLOAD } from "$lib/PayloadStore";
    import { placeholderMatchRegExp } from "$lib/utils";
    import { onMount } from "svelte";

    export let flowName;
    export let operation;

    onMount(() => {
        // Fixes null enabled prop
        if (operation.enabled == undefined) {
            operation.enabled = true;
        }
    })

    const ALLOWED_DROPDOWN_OPERATIONS = ['run_flow', 'run_flow_iterations', 'run_flow_for_each', 'check_element', 'branch_eval'];

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
        },
        {
            name: 'toggle_active',
            type: 'toggle',
            state: operation.enabled,
            icon: {
                on: 'ti-toggle-right',
                off: 'ti-toggle-left'
            },
            action: {
                on: () => operation.enabled = true,
                off: () => operation.enabled = false,
            }
        }
    ];
</script>

<div class="mb-4 p-4 border-2 border-neutral-800 rounded-lg" id={ operation.id }>
    <div class="flex flex-row justify-between">
        <h5 class="mb-4 text-left">
            <i class={`ti ${ operation.icon || 'ti-topology-ring-2' } text-blue-500 mr-1 text-2xl`}></i>
            { operation.label }
        </h5>
        {#if !operation.enabled}
            <p class="border-red-900 border text-red-700 mb-4 px-2 py-1 text-sm rounded">Operation disabled</p>
        {/if}

        <CollapsableOptions options={OPERATION_CONFIG_OPTIONS} />
    </div>

    <div class="grid grid-cols-[min-content_auto] gap-y-3">
        <!-- Checks for Input Fields -->
        {#if operation?.input_fields}

            <!-- Loops each Input Field -->
            {#each Object.entries(operation.input_fields) as [field_name, field]}

                <!-- If it's not a button, it creates a Label for the input -->
                {#if field.type !== 'btn'}
                    <label class="col-start-1 col-end-2 whitespace-nowrap pr-4 my-auto" for={ field_name }>{ field.label }</label>
                {/if}

                <!-- Determines which kind of Input Field it its -->
                {#if field.type === 'text' || field.type === 'textarea'}
                    <input 
                        class:code_font={field.code_font}
                        class={`col-start-2 input-md ${ field.value.match(placeholderMatchRegExp) ? 'font-code text-green-600' : 'font-sans' }`}
                        bind:value={ field.value } 
                        id={ field_name } 
                        type="text" 
                        placeholder={ field.placeholder }
                    >
                {:else if field.type === 'dropdown'}
                    <Dropdown 
                        options={ 
                            ALLOWED_DROPDOWN_OPERATIONS.includes(operation.command)
                            ? Object.keys($PAYLOAD.flows).map(_flow => ({ value: _flow, label: _flow }))
                            : field.options
                        }
                        bind:selectedOption={ field.value }
                        selectedOptionLabel={ field.value }
                        capitalizeOptionLabel={true}
                    />
                {:else if field.type === 'btn'}
                    <button  class="btn-sm col-span-full w-full">{ field.label }</button>
                {/if}

            {/each}

        {:else}
            <p class="col-span-full text-neutral-500">No inputs required :D</p>
        {/if}
    </div>
</div>

<style lang="postcss">
    .op_disabled {
        @apply text-neutral-600;
    }

    .code_font {
        @apply font-code text-orange-500;
    }
</style>