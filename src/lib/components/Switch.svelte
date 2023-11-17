<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();

    export let label = '';
    export let icon = {
        on: 'ti-toggle-right',
        off: 'ti-toggle-left'
    }

    // Logic has to be inverted, for some reason T _ T
    export let unchecked = true;

    $: iconClass = unchecked ? `${ icon.off } text-neutral-400` : `${ icon.on } text-green-400`;

    function onToggle () {
        dispatch('toggle', unchecked);
        console.log(unchecked);
    }
</script>

<label class="flex items-center w-fit select-none cursor-pointer">
    { label }
    <i class={`ti ${ iconClass } ml-2 text-2xl text-neutral-400`}></i>
    <input on:change={onToggle} bind:checked={unchecked} class="absolute invisible" type="checkbox">
</label>