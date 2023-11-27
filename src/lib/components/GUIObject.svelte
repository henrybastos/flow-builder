<script>
    export let isCollapsed = false;
    export let values = [];
</script>

<div class="gui_object">
    {#if values}
            {#each Object.entries(values) as [key, value]}
                {#if typeof value === 'string'}
                    <span class="gui_object_value">{ value }</span>
                {:else}
                    <span class="gui_object_label" on:click={() => isCollapsed = !isCollapsed}>
                        <i class={`ti ti-chevron-right ${ isCollapsed ? 'rotate-0' : 'rotate-90' }`}></i>
                        { Array.isArray(value) ? key : Object.keys(value)[0] }
                    </span>

                    <div class={`gui_object_body ${ isCollapsed ? 'max-h-0' : 'max-h-[100rem]' }`}>
                        <svelte:self values={ Array.isArray(value) ? value : value[Object.keys(value)[0]]} />
                    </div>
                {/if}
            {/each}
    {:else}
        <span class="gui_object_value">Nothing to see</span>
    {/if}
</div>