<script>
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";
    import Modal from "./Modal.svelte";
    import { PAYLOAD } from "$lib/PayloadStore";

    let payloadModal;
    let isFLowAPILoading;
    let payloadModalTextearea;
    let runFlowMessage = {
        type: 'error',
        message: ''
    };

    function transformToJSON () {
        let payloadBuffer = structuredClone($PAYLOAD);
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

            payloadBuffer.flows[flow_name] = flowBuffer;

            console.log('Transform to JSON');
        });
        payloadModalTextearea = JSON.stringify(payloadBuffer, null, 3);
    }

    async function sendFlowPayload (_payload) {
        isFLowAPILoading = true;

        if (Object.keys(_payload.flows.main_flow).length > 0) {
            let response = await fetch('http://localhost:5173/api/run-flow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( _payload )
            });

            response = await response.json();

            if (response.error) {
                console.error(response.error);
                console.error('Response error');
                // runFlowMessage.type = 'error';
                // runFlowMessage.message = response.error.message;
            } else {
                console.log(response);
                console.log('Response success');
                // runFlowMessage.type = 'success';
                // runFlowMessage.message = response.status.message;
            }
        } else {
            console.error('Empty Main Flow. Nothing to run.');
            // runFlowMessage.type = 'error';
            // runFlowMessage.message = 'Empty Main Flow. Nothing to run.';
        }
        isFLowAPILoading = false;
    }

    function loadPayload () {
        const payloadJSON = JSON.parse(payloadModalTextearea);

        PAYLOAD.resetPayload();
        PAYLOAD.setEnv(payloadJSON.env);

        console.log(payloadJSON);

        Object.entries(payloadJSON.flows).forEach(([ _flow_name, _flow_body ]) => {
            PAYLOAD.addFlow(_flow_name);
            Object.values(_flow_body).forEach((operation) => {
                if ( $FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] ) {
                    const operationBody = structuredClone( $FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] );
                    
                    if (operationBody?.input_fields) {
                        // if (_operation_body?.input_fields) {
                        //     Object.values(_operation_body.input_fields).forEach(input => {
                        //         if (input.type === 'dropdown') {
                        //             input.options = Object.keys(flows);
                        //         }
                        //     })
                        // }

                        Object.entries(operationBody.input_fields).forEach(([key, value]) => {
                            value.value = operation[key];
                        })
                    }

                    PAYLOAD.addCommand(_flow_name, operationBody);
                }
            })
        });

        console.log($PAYLOAD);
        payloadModal.close();
    }

    function addFlowOperationBody (_operation_body, _flow_name) {
            
        // if (flows[_flow_name]) {
        //     flows[_flow_name] = [...flows[_flow_name], _operation_body];
        // } else {
        //     flows[_flow_name] = [_operation_body];
        // }

        // addOperationsModal.close();
    }

    function onPayloadModalOpenHandler () {
        transformToJSON();
    }

    function onPayloadModalCloseHandler () {
        runFlowMessage.message = '';
    }
</script>

<button on:click={() => payloadModal.open()} class="btn-md btn-full mb-4">
    <i class="ti ti-script text-blue-500"></i>
    Process JSON
</button>

<Modal on:open={onPayloadModalOpenHandler} on:close={onPayloadModalCloseHandler} bind:this={payloadModal} title="Payload">
    <textarea class="code" bind:value={payloadModalTextearea} name="" id="" cols="30" rows="20"></textarea>
    
    {#if runFlowMessage.message !== ''}
        <span class={`${ runFlowMessage.type === 'error' ? 'text-red-600' : 'text-green-600' } mt-4`}>
                <i class="ti ti-exclamation-circle text-lg mr-2 align-middle"></i>
                { runFlowMessage.message }
        </span>
    {/if}

    <div class="btn-bar">
        <button disabled={isFLowAPILoading} on:click={async () => await sendFlowPayload(JSON.parse(payloadModalTextearea))} class="btn-md w-full mt-4">
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
    </div>
</Modal>