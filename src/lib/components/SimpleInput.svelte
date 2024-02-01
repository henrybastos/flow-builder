<script lang="ts">
    import { cn } from "$lib/utils";
    import Input from "$lib/components/ui/input/input.svelte";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Label from "$lib/components/ui/label/label.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import { SvelteComponent, onMount } from "svelte";

    export let labelContent: string;
    export let inputType: 'password' | 'text' | 'number' | 'email' = 'text';
    export let dataType: string;
    export let fieldType: 'dicionário' | 'lista';
    export let placeholderContent: string;
    export let autofocus = false;
    export let value: string;

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
    {#if autofocus}
        <Input autofocus {value} on:change class="text-base mt-1 mb-3 last:mb-0" placeholder={placeholderContent} type={inputType}/>
    {:else}
        <Input  {value} on:change class="text-base mt-1 first:mt-0" placeholder={placeholderContent} type={inputType}/>
    {/if}
</div>