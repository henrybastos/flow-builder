<script>
    import { onMount } from "svelte";
    import { LOGGER } from "$lib/LogStore";
    import Modal from "../../components/Modal.svelte";
    import TabsBar from "../../components/TabsBar.svelte";
    import PayloadTab from "./PayloadTab.svelte";
    import ConsoleTab from "./ConsoleTab.svelte";
    import ResponsePayloadTab from "./ResponseTab.svelte";

    const tabs = ['payload', 'console', 'response payload'];
    let payloadModal;

    onMount(() => {
        if (localStorage.getItem('logs')) {
            LOGGER.loadLogs(localStorage.getItem('logs'));
        }
    })

    function onPayloadModalCloseHandler () {
        runFlowMessage.message = '';
    }
</script>

<button on:click={() => payloadModal.open()} class="btn-md">
    <i class="ti ti-script text-blue-500"></i>
    Process JSON
</button>

<Modal 
    title="Payload" 
    class="w-[90vw]"
    bind:this={payloadModal} 
    let:showToast 
    let:showDanger 
    on:close={onPayloadModalCloseHandler} 
>
    <TabsBar let:activeTab modalTabs={tabs}>
        {#if activeTab === 'payload'}
            <PayloadTab {showToast} />
        {:else if activeTab === 'console'}
            <ConsoleTab {showDanger} {showToast} />
        {:else if activeTab === 'response payload'}
            <ResponsePayloadTab />    
        {/if}
    </TabsBar>
</Modal>