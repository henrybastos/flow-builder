<script>
    import Modal from "../components/Modal.svelte";
    import { PAYLOAD } from "$lib/PayloadStore";
    import { convertToSnakeCase } from "$lib/utils";

    let addFlowModal;
    let newFlowName;
    let isWSFlow = false;

    function addFlow () {
        PAYLOAD.addFlow(convertToSnakeCase(newFlowName), isWSFlow);
        PAYLOAD._fix_fixNullConfig();
        addFlowModal.close();
    }

    function onWSSwitchToggle ({ detail }) {
        isWSFlow = detail;
    }
</script>

<button on:click={() => addFlowModal.open()} class="btn-md">
    <i class="ti ti-s-turn-right text-blue-500"></i>
    Add flow
</button>

<Modal on:close={() => newFlowName = ''} bind:this={addFlowModal} title="Add flow">
    <div class="btn-bar">
        <input class="input input-md col-span-full w-full" type="text" bind:value={newFlowName}>
        <button class="btn btn-md w-full border-neutral-700" on:click={addFlow}>Add</button>
        <button class="btn btn-md w-full border-neutral-700" on:click={() => addFlowModal.close()}>Cancel</button>
    </div>
</Modal>