<script lang="ts">
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Label from "$lib/components/ui/label/label.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";

    /**
     * A descriptive type of what this data means to the system. e.g. a link, an XPath expression, a name etc
     */
    export let tooltip: string = '';
    export let groupType: 'object' | 'array' | '' = '';

    const groupTypeTooltipContent = {
        object: {
            label: 'Dicionário',
            tooltip: 'Múltiplos valores nomeados. Ex.: Nome: Fulano da Silva'
        },
        array: {
            label: 'Lista',
            tooltip: 'Múltiplos valores ordenados sem nome. Ex.: Banana, Maçã, Pera'
        }
    }
</script>

<Label class="text-lg flex mb-1 mt-2 whitespace-nowrap mr-3 h-min">
    <slot />

    {#if groupType}
        <Tooltip.Root>
            <Tooltip.Trigger tabindex={-1} class="cursor-help">
                <Badge class="ml-1 mb-1 uppercase text-neutral-300 pointer-events-none" variant="secondary">{groupTypeTooltipContent[groupType].label}</Badge>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p class="text-sm">{ groupTypeTooltipContent[groupType].tooltip }</p>
            </Tooltip.Content>
        </Tooltip.Root>
    {/if}

    {#if tooltip}    
        <Tooltip.Root>
            <Tooltip.Trigger tabindex={-1} class="cursor-help">
                <i class="ti ti-info-circle text-xl ml-1 text-neutral-600 hover:text-neutral-400"></i>
            </Tooltip.Trigger>
            <Tooltip.Content>
            <p class="text-base">{ tooltip }</p>
            </Tooltip.Content>
        </Tooltip.Root>
    {/if}
</Label>