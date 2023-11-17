<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label = '';
    export let icon = {
        on: 'ti-toggle-right',
        off: 'ti-toggle-left'
    }

    export let checkState = false;

    let onClass = `${ icon.on } text-green-400`;
    let offClass = `${ icon.off } text-neutral-400`;

    function onToggle () {
        dispatch('toggle', checkState);
    }
</script>

<label class="flex items-center w-fit select-none cursor-pointer">
    { label }
    <i class={`ti ${ checkState ? onClass : offClass } ml-2 text-2xl text-neutral-400`}></i>
    <input on:change={onToggle} bind:checked={checkState} class="bg-red-600 absolute invisible" type="checkbox" name="" id="">
</label>