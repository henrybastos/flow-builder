<script>
    import { onMount } from "svelte";
    import { LOGGER } from "$lib/LogStore";
    import Modal from "../../components/Modal.svelte";
    import TabsBar from "../../components/TabsBar.svelte";
    import PayloadTab from "./PayloadTab.svelte";
    import ConsoleTab from "./ConsoleTab.svelte";
    import ResponsePayloadTab from "./ResponseTab.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

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

<Button variant="secondary" on:click={() => payloadModal.open()}>
    <i class="ti ti-script text-blue-500 mr-2"></i>
    Process JSON
</Button>

<Modal 
    title="Payload" 
    class="w-[90vw]"
    bind:this={payloadModal} 
    let:showToast 
    let:showDanger 
    on:open
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