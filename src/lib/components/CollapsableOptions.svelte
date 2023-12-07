<script>
    let isOptionnCollapsed = true;

    export let options;
    let className = 'text-2xl hover:text-neutral-300  text-neutral-500  cursor-pointer ml-2';

    function toggleAction ({state, action}) {
        if (state) {
            action.off();
        } else {
            action.on();
        }
    }
</script>

<div class="flex flex-row flex-nowrap">
    <i on:click={() => isOptionnCollapsed = !isOptionnCollapsed} class="ti ti-settings text-2xl text-neutral-600 hover:text-neutral-200 cursor-pointer" />
    <div class={`flex flex-row overflow-hidden ${ isOptionnCollapsed ? 'max-w-0' : 'max-w-7xl' }`}>
        <p class="ml-2 text-neutral-700 text-2xl">|</p>
        {#each options as option}
            {#if option.type === 'toggle'}
                <i 
                    class:danger_option={option?.danger} 
                    class:option_active={option.state}
                    class={`ti ${ option.state ? option.icon.on : option.icon.off } ${ className }`} 
                    on:click={ () => { toggleAction(option); option.state = !option.state} }
                ></i>
            {:else}
                <i 
                class:danger_option={option?.danger} 
                class={`ti ${ option.icon } ${ className }`} 
                on:click={ option.action }
            ></i>
            {/if}
        {/each}
    </div>
</div>

<style lang="postcss">
    .danger_option { 
        @apply hover:text-red-500;
    }

    .option_active {
        @apply text-green-500 hover:text-neutral-300;
    }
</style>