<script>
    import Modal from "./Modal.svelte";
    import { PAYLOAD } from "$lib/PayloadStore";
    import { convertToSnakeCase } from "$lib/utils";

    let addFlowModal;
    let newFlowName;

    function addFlow () {
        PAYLOAD.addFlow(convertToSnakeCase(newFlowName));
        addFlowModal.close();
    }
</script>

<button on:click={() => addFlowModal.open()} class="btn-md w-full col-span-full">
    <i class="ti ti-s-turn-right text-blue-500"></i>
    Add flow
</button>

<Modal on:close={() => newFlowName = ''} bind:this={addFlowModal} title="Add flow">
    <div class="btn-bar">
        <input class="input input-md col-span-full" type="text" bind:value={newFlowName}>
        <button class="btn btn-md w-full border-neutral-700" on:click={addFlow}>Add</button>
        <button class="btn btn-md w-full border-neutral-700" on:click={() => addFlowModal.close()}>Cancel</button>
    </div>
</Modal>