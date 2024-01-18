<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label = '';
    export let disabled = false;

    export let checked = false;

    // FIXME: Should be separate?
    $: disabled ? checked = false : checked = checked;

    function onToggle () {
        dispatch('toggle', !checked);
    }
</script>

<label class="flex items-center w-fit select-none cursor-pointer">
    { label }
    <input {disabled} on:change={onToggle} bind:checked={checked} class="absolute invisible" type="checkbox">
    <span class={`border-2 border-neutral-600 rounded-md p-1 w-12 ${ disabled ? 'cursor-not-allowed' : 'cursor-pointer' }`}>
        <span class={`block h-4 w-4 rounded-sm transition-all ${ checked ? 'ml-5 bg-green-400' : 'ml-0 bg-neutral-600' }`}></span>
    </span>
</label>