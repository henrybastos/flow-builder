<script>
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";
    import { PAYLOAD } from "$lib/PayloadStore";
    import Modal from "./Modal.svelte";
    import TabsBar from "./TabsBar.svelte";
    import { LOGGER, TAGS } from "$lib/LogStore";
    import LogMessage from "./LogMessage.svelte";
    import { onMount } from "svelte";

    const controller = new AbortController();

    let payloadModal;
    let isFLowAPILoading;
    let payloadModalTextearea;
    let runFlowMessage = {
        type: 'error',
        message: ''
    };
    let tabs = ['payload', 'console'];

    onMount(() => {
        console.log();
    })

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
        let response;
        isFLowAPILoading = true;

        if (Object.keys(_payload.flows.main_flow).length > 0) {
            try {
                let response = await fetch('http://localhost:5173/api/run-flow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( _payload )
                });
                LOGGER.logMessage('Parsing response to JSON...', $TAGS.system);

                console.log('Parsing response to JSON...');
                response = await response.json();
                console.log(response);

                LOGGER.logMessage('Done!', $TAGS.success);
                LOGGER.logMessage(`WS Endpoint: ${ response.body.ws_endpoint }`, $TAGS.success);
                console.log('Done');
            } catch (err) {
                console.error(body.error);
                LOGGER.logMessage('Fetch error. Something went wrong.', $TAGS.error);
            }
        } else {
            LOGGER.logMessage('Main Flow cannot be empty. Nothing to run.', $TAGS.error);
            console.error('Empty Main Flow. Nothing to run.');
        }

        isFLowAPILoading = false;
    }

    function loadPayload () {
        const payloadJSON = JSON.parse(payloadModalTextearea);

        PAYLOAD.resetPayload();
        PAYLOAD.setEnv(payloadJSON.env);

        Object.entries(payloadJSON.flows).forEach(([ _flow_name, _flow_body ]) => {
            PAYLOAD.addFlow(_flow_name);

            Object.values(_flow_body).forEach((operation) => {
                if ( $FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] ) {
                    const operationBody = structuredClone( $FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] );
                    
                    if (operationBody?.input_fields) {

                        Object.entries(operationBody.input_fields).forEach(([key, value]) => {
                            value.value = operation[key];
                        })
                    }

                    PAYLOAD.addOperation(_flow_name, operationBody);
                }
            })
        });

        console.log(payloadJSON);
        if (payloadJSON.config) {
            PAYLOAD.loadConfig(payloadJSON.config);
        } else {
            PAYLOAD._fix_fixNullConfig();
        }

        console.log($PAYLOAD);
        payloadModal.close();
    }

    function onPayloadModalOpenHandler () {
        transformToJSON();
    }

    function onPayloadModalCloseHandler () {
        runFlowMessage.message = '';
    }
</script>

<button on:click={() => payloadModal.open()} class="btn-md">
    <i class="ti ti-script text-blue-500"></i>
    Process JSON
</button>

<Modal on:open={onPayloadModalOpenHandler} on:close={onPayloadModalCloseHandler} bind:this={payloadModal} title="Payload" class="w-[90vw]">
    <TabsBar let:activeTab modalTabs={tabs}>
        {#if activeTab === 'payload'}
            <textarea class="font-code" bind:value={payloadModalTextearea} name="" id="" cols="30" rows="20"></textarea>
            
            {#if runFlowMessage.message !== ''}
                <span class={`${ runFlowMessage.type === 'error' ? 'text-red-600' : 'text-green-600' } mt-4`}>
                        <i class="ti ti-exclamation-circle text-lg mr-2 align-middle"></i>
                        { runFlowMessage.message }
                </span>
            {/if}

            
            <div class="console_screen mt-4 items-center">
                {#if Object.values($LOGGER.messages).length > 0}
                    <span class="whitespace-nowrap mr-1 font-code">Last message:</span>
                    <LogMessage message={Object.values($LOGGER.messages).slice(-1)[0]} />
                {:else}
                    <span class="text-neutral-500">Nothing to see here =)</span>
                {/if}
            </div>
        
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

                <!-- <button on:click={() => controller.abort()} class="btn-md w-full mt-4">
                    <i class="ti ti-file-upload text-blue-500"></i>
                    Abort
                </button> -->
            </div>
        {:else if activeTab === 'console'}
            <div class="console_screen flex-col">
                {#each Object.entries($LOGGER.messages) as [msg_key, msg], _ (msg_key)}
                    <LogMessage message={msg} />
                {/each}
            </div>
        {/if}
    </TabsBar>
</Modal>