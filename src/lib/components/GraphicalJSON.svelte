<script>
    import { slide } from "svelte/transition";

    export let isCollapsed = false;
    export let key, values;
</script>

<button class="gui_object_label" on:click={() => isCollapsed = !isCollapsed}>
    <i class={`ti ti-chevron-right mr-2 ${ isCollapsed ? 'rotate-0' : 'rotate-90' }`}></i>
    { key }
</button>

{#if !isCollapsed}    
    <div class="gui_object">
        {#each Object.entries(values) as [key, value]}
            {#if typeof value === 'string'}
                <span class="gui_object_value">{ Array.isArray(values) ? value : `${ key } : ${ value }` }</span>
            {:else}
                <div transition:slide={{ duration: 400 }} class='gui_object_body'>
                    <svelte:self key={ Array.isArray(value) ? key : Object.keys(value)[0] } values={ Array.isArray(value) ? value : value[Object.keys(value)[0]] } />
                </div>
            {/if}
        {/each}
    </div>
{/if}