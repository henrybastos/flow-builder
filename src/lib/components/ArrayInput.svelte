<script lang="ts">
    import { cn } from "$lib/utils";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Label from "$lib/components/ui/label/label.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import DraggableList from "./DraggableList.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    export let labelContent: string;
    export let inputType: 'password' | 'text' | 'number' | 'email' = 'text';
    export let dataType: string;
    export let fieldType: 'dicionário' | 'lista';
    export let placeholderContent: string;
    export let autofocus = false;
    export let value: string;
    export let items: any[];

    const fieldTypeTooltipContent = {
        'dicionário': 'Múltiplos valores nomeados. Ex.: Nome: Fulano da Silva',
        'lista': 'Múltiplos valores ordenados sem nome. Ex.: Banana, Maçã, Pera'
    }
</script>

<div class={cn("text-lg", $$restProps.class)}>
    {#if labelContent}
        <Label class="text-lg flex mb-1 mt-2">
            {labelContent}

            {#if fieldType}
                <Tooltip.Root>
                    <Tooltip.Trigger class="cursor-help">
                        <Badge class="ml-1 mb-1 uppercase text-neutral-300 pointer-events-none" variant="secondary">{fieldType}</Badge>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                        <p class="text-sm">{ fieldTypeTooltipContent[fieldType] }</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            {/if}

            {#if dataType}    
                <Tooltip.Root>
                    <Tooltip.Trigger class="cursor-help">
                        <i class="ti ti-info-circle text-xl ml-1 text-neutral-600 hover:text-neutral-400"></i>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
                    <p class="text-sm">Do tipo { dataType }</p>
                    </Tooltip.Content>
                </Tooltip.Root>
            {/if}
        </Label>
    {/if}

    <div class="flex flex-col border border-neutral-800 rounded-md p-3 gap-y-2 mt-1 mb-3 last:mb-0">
        {#if items.length === 0}
            <p class="text-base mx-auto text-neutral-500">No items <i class="ti ti-ghost-2-filled"></i></p>    
        {:else}
            <DraggableList bind:itemsList={items} let:item let:index>
                <Input on:change={({ target }) => items[index] = target?.value} class="text-base mt-1 first:mt-0" placeholder="Item {index + 1}" type={inputType}/>
            </DraggableList>
        {/if}

        <Button on:click={() => items.push('')} size="sm" variant="ghost">
            <i class="ti ti-plus"></i>
        </Button>

        <Button on:click={() => console.log(items)} size="sm" variant="ghost">See</Button>
    </div>
</div>