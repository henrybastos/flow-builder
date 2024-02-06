<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { cn } from "$lib/utils";
    import Button from "$lib/components/ui/button/button.svelte";
    import type { EnvProps } from "$lib/types";
    import DraggableList from "../DraggableList.svelte";

    export let inputType: 'password' | 'text' | 'number' | 'email' = 'text';
    export let isReadOnly = false;
    export let items: any[];
    export let externalStorage = items;
    export let schema;
    export let template_schema;
    
    // $: externalStorage = structuredClone(items);

    let isInputEditable = false;
    const dispatch = createEventDispatcher();

    function addItem () {
        // dispatch('add_item', items);
        console.log('<<', items, template_schema);
        items = [
            ...(items),
            structuredClone(template_schema)
        ]
    }
</script>

<div class={cn("text-lg", $$restProps.class)}>
    <div class="flex flex-col border border-neutral-800 rounded-md p-3 gap-y-2 mt-1 mb-3 last:mb-0">
        <!-- <pre>{ JSON.stringify(items, null, 3) }</pre> -->
        <slot {isInputEditable} />
        {#if !isReadOnly}  
            <div class="pb-2 sticky -bottom-1 bg-neutral-950">
                <div class="grid grid-cols-2 gap-x-2 mt-2">
                    <Button on:click={addItem} size="sm" variant="ghost">
                        <i class="ti ti-plus"></i>
                    </Button>
            
                    <Button on:click={() => isInputEditable = !isInputEditable} variant="ghost">
                        {#if isInputEditable}
                            Organizar <i class="ti ti-arrows-move ml-1"></i>
                        {:else}
                            Editar <i class="ti ti-pencil ml-1"></i>
                        {/if}
                    </Button>
                </div>
            </div>  
        {/if}
    </div>
</div>


<!-- <DraggableList on:change isDraggable={!isInputEditable} bind:itemsList={items.value} let:index class="space-y-3">
    {#if items.schema.fields_type === 'array'}
        <div class={`grid grid-cols-[min-content_auto] p-4 border border-neutral-800 rounded-md ${ isInputEditable ? '' : 'cursor-move' }`}>
            {#each Object.entries(items.schema.fields) as [_item_key, _item_schema]}
                <ComposeLabel tooltip={_item_schema.tooltip}>{ _item_schema.label }</ComposeLabel>
                <ComposeInput 
                    bind:value={items.value[index][_item_key]}
                    inputType={_item_schema.type} 
                    placeholder={_item_schema.placeholder} 
                    on:change={(evt) =>  updateStruct(evt, index, _item_key)}
                    readonly={!isInputEditable}
                />
            {/each}
            
        </div>
    {:else}
        {#if isInputEditable}
            <Input bind:value={items.value[index]} on:change={(evt) => updateString(evt, index)} class="text-base mt-1 first:mt-0 placeholder:text-neutral-500" placeholder={items.schema.placeholder} type="text"/>
        {:else}
            <Input bind:value={items.value[index]} readonly class="text-base mt-1 first:mt-0 cursor-default placeholder:text-neutral-500" placeholder={items.schema.placeholder} type={inputType}/>
        {/if}
    {/if}
</DraggableList> -->