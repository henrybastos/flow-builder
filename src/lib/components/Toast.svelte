<script>
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    let isToastVisible;

    export let message = 'blank_toast_message';

    /** @type {'success'|'info'|'error'|'danger'} */
    export let type = 'info';

    onMount(() => {
        isToastVisible = true;

        setTimeout(() => {
            isToastVisible = false;
        }, 3000);
    })
</script>

{#if isToastVisible}
    <div in:fly={{ x: 25, duration: 1000 }} out:fly={{ x: 25, duration: 1000 }} class={`${ type } px-6 py-3 mr-5 rounded-md mb-3 drop-shadow-lg shadow-[#00000088]`}>
        <p class="text-lg">{ message }</p>
    </div>
{/if}
