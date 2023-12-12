<script>
    import { onMount } from "svelte";
    import { LOGGER } from "$lib/LogStore";
    import Modal from "../../components/Modal.svelte";
    import TabsBar from "../../components/TabsBar.svelte";
    import PayloadTab from "./PayloadTab.svelte";
    import ConsoleTab from "./ConsoleTab.svelte";
    import ResponsePayloadTab from "./ResponseTab.svelte";

    export let showGlobalToast;
    export let payloadModalTextearea;

    const tabs = ['payload', 'console', 'response payload'];
    let payloadModal;

    onMount(() => {
        if (localStorage.getItem('logs')) {
            LOGGER.loadLogs(localStorage.getItem('logs'));
        }
    })

    function onPayloadLoaded () {
        showGlobalToast('Payload loaded!', 'success');
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
>
    <TabsBar let:activeTab modalTabs={tabs}>
        {#if activeTab === 'payload'}
            <PayloadTab on:payload_loaded={onPayloadLoaded} {showToast} {payloadModal} bind:payloadModalTextearea={payloadModalTextearea} />
        {:else if activeTab === 'console'}
            <ConsoleTab {showDanger} {showToast} />
        {:else if activeTab === 'response payload'}
            <ResponsePayloadTab />    
        {/if}
    </TabsBar>
</Modal>