<script>
    import Modal from "./Modal.svelte";
    import PAYLOAD from "$lib/PayloadStore";
    let payloadModal;

    function openPayloadModal () {
        exportFlowsToJson();
        // payloadModalTextearea = JSON.stringify(payload, null, 3);
        payloadModal.open();
    }

    async function exportFlowsToJson () {
        // Object.entries(flows).forEach(([flow_name, flow_body]) => {
        //     let flowBuffer = [];

        //     for (let block of flow_body) {
        //         let commandBody = {};
        //         commandBody.command = block.command;

        //         if (block?.input_fields) {
        //             Object.entries(block.input_fields).forEach(([field_name, field]) => {
        //                 commandBody[field_name] = field.value;
        //             })
        //         }

        //         flowBuffer.push(commandBody);
        //     }
        //     payload.flows[flow_name] = flowBuffer;
        // });

        Object.entries($PAYLOAD.flows).forEach(([flow_name, flow_body]) => {
            let flowBuffer = [];

            for (let operation of Object.values(flow_body)) {
                let operationBody = {};
                operationBody.command = operation.command;

                if (operation?.input_fields) {
                    Object.entries(operation.input_fields).forEach(([field_name, field]) => {
                        operationBody[field_name] = field.value;
                    })
                }

                flowBuffer.push(operationBody);
            }

            PAYLOAD.loadFlow(flow_name, flowBuffer);
            console.log($PAYLOAD);
        });
    }
</script>

<button on:click={openPayloadModal} class="btn-md btn-full mb-4">
    <i class="ti ti-script text-blue-500"></i>
    Process JSON
</button>

<Modal bind:this={payloadModal} title="Payload" on:close={() => runFlowMessage.message = ''}>
    <textarea class="code" value={JSON.stringify($PAYLOAD, null, 3)} name="" id="" cols="30" rows="20"></textarea>
    
    <!-- {#if runFlowMessage.message !== ''}
        <span class={`${ runFlowMessage.type === 'error' ? 'text-red-600' : 'text-green-600' } mt-4`}>
                <i class="ti ti-exclamation-circle text-lg mr-2 align-middle"></i>
                { runFlowMessage.message }
        </span>
    {/if}

    <div class="btn-bar">
        <button disabled={isFLowAPILoading} on:click={async () => await sendFlowPayload(payload)} class="btn-md w-full mt-4">
            {#if isFLowAPILoading}
                <span class="w-full inline-flex justify-center">
                    <i class="ti ti-loader-2 text-neutral-400 animate-spin-icon"></i>
                </span>
            {:else }
                <i class="ti ti-arrows-split-2 text-blue-500"></i>
                Run flow
            {/if}
        </button>

        <button on:click={loadPayload} class="btn-md w-full mt-4">
            <i class="ti ti-file-upload text-blue-500"></i>
            Load payload
        </button>
    </div> -->
</Modal>