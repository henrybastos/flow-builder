<script>
    let isOptionnCollapsed = true;
    let isFieldsetCollapsed = false;
    
    export let legend;
    export let className = '';
    
    export let isDynamic = false;
    export let options = [
        {
            icon_on: 'ti-trash',
            action: () => alert('Delete!')
        },
        {
            icon: 'ti-layout-bottombar-expand',
            action: () => alert('Delete!')
        }
    ];

    export function toggleFieldsetSize () {
        isFieldsetCollapsed = !isFieldsetCollapsed;
    }
</script>


<!-- svelte-ignore a11y-click-events-have-key-events -->
<fieldset class={` ${ className } ${ isFieldsetCollapsed ? 'max-h-0' : 'max-h-[4000rem]' }`}>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <legend class={`${ isDynamic ? 'cursor-pointer hover:ml-1 transition-all' : '' }`} on:click={() => isOptionnCollapsed = !isOptionnCollapsed}>
        { legend }
        {#if isDynamic}
            <div class:invisible={isOptionnCollapsed} class="inline-flex w-fit overflow-hidden transition-all">
                {#each options as option}
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <i 
                        on:click={() => option.action(this) }
                        class={`ti ${ option.icon } ml-2 hover:text-red-600 cursor-pointer`}
                    />
                {/each}
            </div>
        {/if}
    </legend>
    <slot />
 </fieldset>

 <style lang="postcss">
    .invisible {
        @apply w-0;
    }
 </style>