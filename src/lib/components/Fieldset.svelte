<script>
    export let isOptionnCollapsed = true;

    export let isFieldsetCollapsed = false;
    
    export let legend;
    export let fieldsetCollapsedPlaceholder = '...';
    
    export let isDynamic = false;
    export let extraOptions;
    let options = {
        ...extraOptions,
        toggleFieldset: {
            icon: 'ti-arrows-vertical',
            action: toggleFieldsetSize
        }
    };

    $: options.toggleFieldset.icon = isFieldsetCollapsed ? 'ti-arrows-diagonal' : 'ti-arrows-diagonal-minimize-2';

    export function toggleFieldsetSize () {
        isFieldsetCollapsed = !isFieldsetCollapsed;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<fieldset class={`nstd ${ $$restProps?.class || '' }`}> 
    {#if isFieldsetCollapsed}
        <span on:click={toggleFieldsetSize} class="font-medium text-lg text-center text-neutral-500 hover:text-neutral-400 cursor-pointer">{ fieldsetCollapsedPlaceholder }</span>
    {/if}
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <legend class={`${ isDynamic ? 'cursor-pointer hover:ml-1 transition-all' : '' }`} on:click={() => isOptionnCollapsed = !isOptionnCollapsed}>
        { legend }
        {#if isDynamic}
            <div class:invisible={isOptionnCollapsed} class="inline-flex w-fit overflow-hidden transition-all">
                {#each Object.values(options) as option}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <i 
                        on:click={() => option.action(isOptionnCollapsed) }
                        class={`ti ${ option.icon } ${ option.danger ? 'hover:text-red-600' : 'hover:text-neutral-50' } text-neutral-400 ml-2 cursor-pointer`}
                    />
                {/each}
            </div>
        {/if}
    </legend>
    <div class={`${ isFieldsetCollapsed ? 'max-h-0 overflow-hidden' : 'max-h-[4000rem] overflow-visible' }`}>
        <slot {isFieldsetCollapsed} />
    </div>
 </fieldset>

 <style lang="postcss">
    .invisible {
        @apply w-0;
    }
 </style>