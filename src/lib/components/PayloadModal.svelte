<script>
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";
    import { PAYLOAD } from "$lib/PayloadStore";
    import Modal from "./Modal.svelte";
    import TabsBar from "./TabsBar.svelte";
    import { LOGGER, TAGS } from "$lib/LogStore";
    import LogMessage from "./LogMessage.svelte";
    import { onMount } from "svelte";
    import { CURRENT_PRESET_NAME, FLOW_PRESETS } from "$lib/PresetsStore";

    const controller = new AbortController();
    $: payloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(payloadModalTextearea) }`;
    $: payloadURIPresetName = `${ $CURRENT_PRESET_NAME?.match(/[A-z,0-9]*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;

    let responsePayload = 'Nothing to display :D';

    let payloadModal;
    let isFLowAPILoading;
    let payloadModalTextearea;
    let runFlowMessage = {
        type: 'error',
        message: ''
    };
    let lastWSEndpoint;
    let tabs = ['payload', 'console', 'response payload'];

    let cancelRequest = false;

    onMount(() => {
        // const SSE = new EventSource('http://localhost:5173/api/run-flow');
        // SSE.onmessage = msg => console.log(msg);
        
        if (localStorage.getItem('logs')) {
            LOGGER.loadLogs(localStorage.getItem('logs'));
        }
        if (localStorage.getItem('last_ws_endpoint')) {
            lastWSEndpoint = localStorage.getItem('last_ws_endpoint');
        }
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

    async function handleStream (_res) {
        const reader = _res.body.pipeThrough(new TextDecoderStream()).getReader();
        await loopReader(reader);
    }

    async function loopReader (_reader) {
        const {value, done} = await _reader.read();
        let SSEData = '';

        if (done) return;
        console.log('Attempting...');

        // To fix
        if (cancelRequest) {
            await _reader.cancel();
        }

        SSEData = parseSSEData(value);
        try { SSEData.data = JSON.parse(SSEData.data) } catch (err) {  };
        LOGGER.logMessage(SSEData.data.message, TAGS[SSEData.data.status_message]);

        if (SSEData.event === 'response') {
            responsePayload = JSON.stringify(SSEData.data.payload, null, 3);
        }

        await loopReader(_reader);
    }

    function parseSSEData (_raw_data) {
        let lines = _raw_data.split('\n').filter(v=>v);

        const [event, data] = lines.map(line => {
            return ( line.slice(7).trim(), line.slice(6).trim() );
        });

        return { event, data };
    }

    async function sendFlowPayload (_payload) {
        isFLowAPILoading = true;
        cancelRequest = false;

        if (Object.keys(_payload.flows.main_flow).length > 0) {
            let response;

            try {
                LOGGER.logMessage('Calling API...', TAGS.info);
                response = await fetch('http://localhost:5173/api/run-flow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( _payload )
                });

                LOGGER.logMessage('Handling response stream...', TAGS.info);

                await handleStream(response);

                // response = await response.json();

                // lastWSEndpoint = response.body.ws_endpoint;
                // localStorage.setItem('last_ws_endpoint', lastWSEndpoint);

                // LOGGER.logMessage(`WS Endpoint: ${ response.body.ws_endpoint }`, TAGS.success);
                if (cancelRequest === true) {
                    LOGGER.logMessage('Request canceled by the user.', TAGS.warning);
                    console.warn('Request canceled by the user.');
                } else {
                    LOGGER.logMessage('Done!', TAGS.success);
                    console.log('Done!');
                }
            } catch (err) {
                console.error(err);
                LOGGER.logMessage('Fetch error. Something went wrong.', TAGS.error);
            }
        } else {
            console.log($LOGGER);
            LOGGER.logMessage('Main Flow cannot be empty. Nothing to run.', TAGS.error);
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

<Modal let:openDangerModal on:open={onPayloadModalOpenHandler} on:close={onPayloadModalCloseHandler} bind:this={payloadModal} title="Payload" class="w-[90vw]">
    <TabsBar let:activeTab modalTabs={tabs}>
        {#if activeTab === 'payload'}

            <div class="inline-flex justify-start">
                <a class="clear-btn mb-2" 
                    href={payloadToURI} 
                    download={payloadURIPresetName}>
                    Download payload
                </a>

                <a class="clear-btn mb-2" 
                    href={`data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify($FLOW_PRESETS)) }`} 
                    download={'all_presets.json'}>
                    Download raw full payload
                </a>
            </div>

            <textarea class="font-code bg-neutral-950 hover:bg-neutral-950" bind:value={payloadModalTextearea} name="" id="" cols="30" rows="20"></textarea>
            
            {#if runFlowMessage.message !== ''}
                <span class={`${ runFlowMessage.type === 'error' ? 'text-red-600' : 'text-green-600' } mt-4`}>
                        <i class="ti ti-exclamation-circle text-lg mr-2 align-middle"></i>
                        { runFlowMessage.message }
                </span>
            {/if}

            
            <div class="console_screen mt-4 items-center overflow-hidden">
                {#if Object.values($LOGGER.messages).length > 0}
                    <span class="whitespace-nowrap mr-1 font-code">Last message:</span>
                    <LogMessage message={Object.values($LOGGER.messages).slice(-1)[0]} />
                {:else}
                    <span class="text-neutral-500">Nothing to see here =)</span>
                {/if}
            </div>
        
            <div class="btn-bar">
                {#if isFLowAPILoading}
                    <button disabled={cancelRequest} on:click={() => cancelRequest = true} class="btn-md w-full mt-4">
                        <span class="w-full inline-flex justify-center">
                            {#if cancelRequest}
                                <i class="ti ti-loader-2 text-neutral-400 animate-spin-icon mr-2"></i>
                                Canceling request
                            {:else}
                                <i class="ti ti-loader-2 text-neutral-400 animate-spin-icon mr-2"></i>
                                Cancel
                            {/if}
                        </span>
                    </button>
                {:else }
                    <button on:click={async () => await sendFlowPayload(JSON.parse(payloadModalTextearea))} class="btn-md w-full mt-4">
                        <i class="ti ti-arrows-split-2 text-blue-500 mr-2"></i>
                        Run flow
                    </button>
                {/if}

        
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
            <button class="clear-btn mb-2" on:click={() => openDangerModal(LOGGER.clearLogs, { danger_modal_title: 'Clear logs from Local Storage?', danger_confirm: 'Clear' })}>Clear logs</button>
            <div class="console_screen flex-col">
                {#each Object.entries($LOGGER.messages) as [msg_key, msg], _ (msg_key)}
                    <LogMessage message={msg} />
                {/each}
            </div>
        {:else if activeTab === 'response payload'}
            <textarea class="font-code bg-neutral-950 hover:bg-neutral-950" bind:value={responsePayload} name="" id="" cols="30" rows="20"></textarea>
        {/if}
    </TabsBar>
</Modal>