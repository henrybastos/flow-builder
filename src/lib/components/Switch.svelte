<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label = '';

    // Logic has to be inverted, for some reason T _ T
    export let unchecked = true;

    function onToggle () {
        dispatch('toggle', unchecked);
        console.log(unchecked);
    }
</script>

<label class="flex items-center w-fit select-none cursor-pointer">
    { label }
    <input on:change={onToggle} bind:checked={unchecked} class="absolute invisible" type="checkbox">
    <span class="border-2 border-neutral-600 rounded-md p-1 w-12">
        <span class={`block h-4 w-4 rounded-sm transition-all ${ unchecked ? 'ml-0 bg-neutral-600' : 'ml-5 bg-green-400' }`}></span>
    </span>
</label>