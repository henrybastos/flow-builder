<script>
    import { createEventDispatcher } from "svelte";
    let isDropdownDialogOpen = false;

    const dispatch = createEventDispatcher();

    /** @type {Array<{label: string, value: string}>} */
    export let options = [];
    export let selectedOption;
    export let selectedOptionLabel = '--'
    export let className = '';

    function selectOption (opt) {
        selectedOption = opt.value;
        selectedOptionLabel = opt.label;
        dispatch('select_option', opt);
    }

    /**
     * Closes the dropdown if user clicks anywhere but the Dropdown button.
     * @param evt Used to identify the element's Kronus Magick Tools Identifier (KMT ID).
     */
    function handleWindowClick (evt) {
        if (evt.target.getAttribute('data-kmt-id') !== 'dropdown') {
            isDropdownDialogOpen = false;
        }
    }
</script>

<svelte:window on:click={handleWindowClick} />

<div class={`relative ${ className }`}>
    <button 
        class="btn-sm btn-full h-12" 
        data-kmt-id="dropdown" 
        on:click={() => isDropdownDialogOpen = !isDropdownDialogOpen}
    >
        { selectedOptionLabel }
    </button>
    
    <dialog class="absolute text-neutral-50 w-full mt-2 rounded-lg open:flex flex-col overflow-hidden bg-neutral-900 border-2 border-neutral-800 drop-shadow-xl z-20" open={isDropdownDialogOpen}>
        {#each options as opt}
            <span on:click={() => selectOption(opt)} class="w-full hover:bg-neutral-800 py-4 transition-all cursor-pointer text-center">{ opt.label }</span>
        {/each}
    </dialog>
</div>
