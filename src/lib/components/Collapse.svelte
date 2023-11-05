<script>
    export let title;
    
    let isCollapsed = true;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click={() => isCollapsed = !isCollapsed} class="border-2 border-neutral-800 hover:border-neutral-700 rounded-lg p-2 cursor-pointer p-4 transition-all">
    <div class="flex flex-row justify-between">
        <p class="text-lg">{ title }</p>
        <i class={`ti ti-chevron-down self-center text-center transition-all duration-[400ms] ${ isCollapsed ? 'rotate-180' : 'rotate-0' }`}></i>
    </div>
    <div class={`${ isCollapsed ? 'max-h-0' : 'max-h-[100rem]' } transition-all overflow-hidden`}>
        <slot />
    </div>
</div>