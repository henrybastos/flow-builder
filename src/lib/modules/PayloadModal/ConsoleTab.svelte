<script>
    import LogMessage from "$lib/components/LogMessage.svelte";
    import { slide } from "svelte/transition";
    import { LOGGER } from "$lib/LogStore";
    export let showDanger;
    export let showToast;

    function clearLogs () {
        showDanger( LOGGER.clearLogs, {
            danger_modal_title: 'Clear logs from Local Storage?', 
            danger_confirm: 'Clear' 
        });
    }
</script>

<section transition:slide={{ duration: 400 }}>
    <button class="clear-btn mb-2" on:click={clearLogs}>Clear logs</button>
    <div class="console_screen flex-col-reverse overflow-y-auto overflow-x-clip max-h-[36rem]">
        {#each Object.entries($LOGGER.messages).reverse() as [msg_key, msg], _ (msg_key)}
            <!-- <span>{ JSON.stringify(msg, null, 3) }</span> -->
            <LogMessage on:clipboard_copy={() => showToast('Copied to clipboard!', 'success')} data={msg} />
        {/each}
    </div>
</section>