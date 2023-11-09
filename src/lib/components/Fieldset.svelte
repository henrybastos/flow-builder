<script>
    let isOptionnCollapsed = true;

    export let isFieldsetCollapsed = false;
    
    export let legend;
    export let className = '';
    
    export let isDynamic = false;
    export let extraOptions;
    let options = {
        ...extraOptions,
        toggleFieldset: {
            icon: 'ti-layout-bottombar-expand',
            action: toggleFieldsetSize
        }
    };

    export function toggleFieldsetSize () {
        isFieldsetCollapsed = !isFieldsetCollapsed;
    }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<fieldset class={className}>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <legend class={`${ isDynamic ? 'cursor-pointer hover:ml-1 transition-all' : '' }`} on:click={() => isOptionnCollapsed = !isOptionnCollapsed}>
        { legend }
        {#if isDynamic}
            <div class:invisible={isOptionnCollapsed} class="inline-flex w-fit overflow-hidden transition-all">
                {#each Object.values(options) as option}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <i 
                        on:click={() => option.action(isOptionnCollapsed) }
                        class={`ti ${ option.icon } ml-2 hover:text-red-600 cursor-pointer`}
                    />
                {/each}
            </div>
        {/if}
    </legend>
    <div class={`overflow-hidden ${ isFieldsetCollapsed ? 'max-h-0' : 'max-h-[4000rem]' }`}>
        <slot />
    </div>
 </fieldset>

 <style lang="postcss">
    .invisible {
        @apply w-0;
    }
 </style>