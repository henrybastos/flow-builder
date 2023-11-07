<script>
    let isOptionnCollapsed = true;

    export let options;
</script>

<div class="flex flex-row flex-nowrap">
    <i on:click={() => isOptionnCollapsed = !isOptionnCollapsed} class="ti ti-settings text-2xl text-neutral-600 hover:text-neutral-200 cursor-pointer" />
    <div class={`flex flex-row overflow-hidden ${ isOptionnCollapsed ? 'max-w-0' : 'max-w-7xl' }`}>
        <p class="ml-2 text-neutral-700 text-2xl">|</p>
        {#each options as option}
            <i class={`ti ${ option.icon } text-2xl ${ option?.danger ? 'hover:text-red-500' : 'hover:text-neutral-300' }  text-neutral-500  cursor-pointer ml-2`} on:click={ option.action }></i>
        {/each}
    </div>
</div>