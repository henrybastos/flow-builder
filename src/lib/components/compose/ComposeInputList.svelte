<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import DraggableList from "../DraggableList.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { cn } from "$lib/utils";

    export let inputType: 'password' | 'text' | 'number' | 'email' = 'text';
    export let items: {
        schema: {
            tooltip: string,
            placeholder: string
        }
        values: any[]
    };

    // let items = structuredClone(items);
    let isInputEditable = false;
    export let isReadOnly = false;

    const dispatch = createEventDispatcher();
    const fieldTypeTooltipContent = {
        'dicionário': 'Múltiplos valores nomeados. Ex.: Nome: Fulano da Silva',
        'lista': 'Múltiplos valores ordenados sem nome. Ex.: Banana, Maçã, Pera'
    }

    function onInputChange (evt: Event, index: number) {
        items.values[index] = (evt.target as HTMLInputElement).value;
        dispatch('change');
    }
</script>

<div class={cn("text-lg", $$restProps.class)}>
    <div class="flex flex-col border border-neutral-800 rounded-md p-3 gap-y-2 mt-1 mb-3 last:mb-0">
        {#if items.values.length === 0}
            <p class="text-base mx-auto text-neutral-500">No items <i class="ti ti-ghost-2-filled"></i></p>    
        {:else}
            <DraggableList on:change isDraggable={!isInputEditable} bind:itemsList={items.values} let:item let:index class="space-y-3">
                {#if isInputEditable}    
                    <Input bind:value={items.values[index]} on:change={(evt) => onInputChange(evt, index)} class="text-base mt-1 first:mt-0 placeholder:text-neutral-500" placeholder={items.schema.placeholder} type="text"/>
                {:else}
                    <Input bind:value={items.values[index]} readonly class="text-base mt-1 first:mt-0 cursor-move placeholder:text-neutral-500" placeholder={items.schema.placeholder} type={inputType}/>
                {/if}
            </DraggableList>
        {/if}

        {#if !isReadOnly}    
            <div class="grid grid-cols-2 gap-x-2 mt-2">
                <Button on:click={() => items.values = [...items.values, '']} size="sm" variant="ghost">
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
        {/if}
    </div>
</div>