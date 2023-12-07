<script>
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";
    import { PAYLOAD } from "$lib/PayloadStore";
    import Modal from "./Modal.svelte";
    import TabsBar from "./TabsBar.svelte";
    import { LOGGER, TAGS } from "$lib/LogStore";
    import LogMessage from "./LogMessage.svelte";
    import { onMount } from "svelte";
    import { FLOW_PRESETS, CURRENT_PRESET_NAME } from "$lib/PresetsStore";
    import GraphicalJson from "./GraphicalJSON.svelte";
    import { slide } from "svelte/transition";

    const controller = new AbortController();
    $: payloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(payloadModalTextearea) }`;
    $: payloadURIPresetName = `${ $CURRENT_PRESET_NAME?.match(/[A-z,0-9]*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;
    
    $: rawPayloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify($PAYLOAD)) }`;
    $: rawPayloadURIPresetName = `raw_${ $CURRENT_PRESET_NAME?.match(/\w*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;

    let responsePayload = JSON.stringify({ response: 'Nothing to display :D' });

    let payloadModal;
    let isFLowAPILoading;
    let payloadModalTextearea;
    let runFlowMessage = {
        type: 'error',
        message: ''
    };
    let tabs = ['payload', 'console', 'response payload'];

    let cancelRequest = false;

    onMount(() => {
        if (localStorage.getItem('logs')) {
            LOGGER.loadLogs(localStorage.getItem('logs'));
        }
    })

    /**
     * Transforms/filters the raw payload to a "readable" one.
     * @param _payload The object to transform.
     */
    function transformToJSON (_payload) {
        let payloadBuffer = structuredClone(_payload);
        Object.entries(payloadBuffer.flows).forEach(([flow_name, flow_body]) => {
            let flowBuffer = [];

            for (let operation of Object.values(flow_body)) {
                let operationBody = {};
                operationBody.command = operation.command;
                operationBody.enabled = operation.enabled;
                

                if (operation?.input_fields) {
                    Object.entries(operation.input_fields).forEach(([field_name, field]) => {
                        operationBody[field_name] = field.value;
                    })
                }

                flowBuffer.push(operationBody);
            }

            payloadBuffer.flows[flow_name] = flowBuffer;
        });
        return JSON.stringify(payloadBuffer, null, 3);
    }

    function encodePresetsToURI () {
        FLOW_PRESETS._fix_fixNullConfigForAll()
        let _payload_list_json = structuredClone($FLOW_PRESETS);
        
        _payload_list_json = Object.entries(_payload_list_json).map(([ preset_name, preset_payload ]) => {
            return [preset_name, JSON.parse(transformToJSON(preset_payload))]
        })

        console.log(_payload_list_json);
        
        return encodeURIComponent(
            JSON.stringify(Object.fromEntries(_payload_list_json), null, 3)
        );
    }

    async function handleStream (_res) {
        const reader = _res.body.pipeThrough(new TextDecoderStream()).getReader();
        await loopReader(reader);
    }

    async function loopReader (_reader) {
        const {value, done} = await _reader.read();
        let SSEData = '';
        
        if (done) return;

        // To fix
        if (cancelRequest) {
            await _reader.cancel();
        }

        SSEData = parseSSEData(value);

        for (let sse_event of SSEData) {
            switch (sse_event.event) {
                case 'response':
                    responsePayload = JSON.stringify(sse_event.data.payload, null, 3);
                    console.dir(responsePayload, { depth: null });
                    LOGGER.logMessage(sse_event.data.message, TAGS[sse_event.data.status_message]);
                    break;
                default:
                    LOGGER.logMessage(sse_event.data.message, TAGS[sse_event.data.status_message]);
                break;
            }
        }

        await loopReader(_reader);
    }

    function parseSSEData (_raw_data) {
        let event_collection = _raw_data.split('\n\n').filter(v=>v);
        
        return event_collection.map(event_lines => {
            const [event, data] = event_lines.split('\n').filter(v=>v).map(line => {
                return ( line.slice(7).trim(), line.slice(6).trim() );
            });
            return { event, data: JSON.parse(data) };
        });
    }

    async function sendFlowPayload (_payload) {
        isFLowAPILoading = true;
        cancelRequest = false;

        if (Object.keys(_payload.flows.main_flow).length > 0) {
            let response;

            try {
                LOGGER.logMessage(`${ $CURRENT_PRESET_NAME ? `[PRESET # ${ $CURRENT_PRESET_NAME }] ` : '' }Calling API...`, TAGS.info);
                response = await fetch('http://localhost:5173/api/run-flow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( _payload )
                });

                LOGGER.logMessage('Handling response stream...', TAGS.info);

                await handleStream(response);

                // WIP
                // if ($PAYLOAD.config.close_browser_on_cancel_request) {
                //     await closeBrowserOnCancelRequest();
                // }

                if (cancelRequest === true) {
                    LOGGER.logMessage('Request canceled by the user.', TAGS.warning);
                    console.warn('Request canceled by the user.');
                } else {
                    LOGGER.logMessage('Finished', TAGS.info);
                    console.log('Finished');
                }
            } catch (err) {
                console.error(err);
                LOGGER.logMessage('Fetch error. Something went wrong.', TAGS.error);
            }
        } else {
            LOGGER.logMessage('Main Flow cannot be empty. Nothing to run.', TAGS.error);
            console.error('Empty Main Flow. Nothing to run.');
        }

        isFLowAPILoading = false;
    }

    async function closeBrowserOnCancelRequest () {
        const closeBrowserPayload = {
            "config": {
                "ws_endpoint": false,
                "close_browser_on_finish": false,
                "close_browser_on_cancel_request": false
            },
            "env": {},
            "flows": {
                "main_flow": [{ "command": "close_browser" }]
            }
        }

        await fetch('http://localhost:5173/api/run-flow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( closeBrowserPayload )
        });
        console.warn('Close!');
    }

    function loadPayload () {
        const payloadJSON = JSON.parse(payloadModalTextearea);

        PAYLOAD.resetPayload();
        PAYLOAD.setEnv(payloadJSON.env);

        Object.entries(payloadJSON.flows).forEach(([ _flow_name, _flow_body ]) => {
            PAYLOAD.addFlow(_flow_name);

            Object.values(_flow_body).forEach((operation) => {
                if ( FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] ) {
                    const operationBody = structuredClone( FLOW_BUILDER_OPERATION_TEMPLATES[operation.command] );
                    operationBody.enabled = operation.enabled;
                    
                    if (operationBody?.input_fields) {
                        Object.entries(operationBody.input_fields).forEach(([key, value]) => {
                            value.value = operation[key];
                        });
                    }

                    PAYLOAD.addOperation(_flow_name, operationBody);
                }
            });
        });

        if (payloadJSON.config) {
            PAYLOAD.loadConfig(payloadJSON.config);
        } else {
            PAYLOAD._fix_fixNullConfig();
        }

        console.log($PAYLOAD);
        payloadModal.close();
    }

    function onPayloadModalOpenHandler () {
        PAYLOAD._fix_fixNullConfig();
        payloadModalTextearea = transformToJSON($PAYLOAD);
    }

    function onPayloadModalCloseHandler () {
        runFlowMessage.message = '';
    }
</script>

<button on:click={() => payloadModal.open()} class="btn-md">
    <i class="ti ti-script text-blue-500"></i>
    Process JSON
</button>

<Modal let:appendModalToast let:openDangerModal on:open={onPayloadModalOpenHandler} on:close={onPayloadModalCloseHandler} bind:this={payloadModal} title="Payload" class="w-[90vw]">
    <TabsBar let:activeTab modalTabs={tabs}>
        {#if activeTab === 'payload'}
            <section transition:slide={{ duration: 400 }}>
                <div class="inline-flex justify-start">
                    <a class="clear-btn mb-2" 
                        href={payloadToURI} 
                        download={payloadURIPresetName}>
                        Download payload
                    </a>
    
                    <a class="clear-btn mb-2" 
                        href={rawPayloadToURI} 
                        download={rawPayloadURIPresetName}>
                        Download raw payload
                    </a>
    
                    <!-- <a class="clear-btn mb-2" 
                        href={`data:text/json;charset=utf-8,${ encodePresetsToURI() }`} 
                        download={'all_presets.json'}>
                        Download raw full payload
                    </a> -->
                </div>
    
                <textarea class="font-code bg-neutral-950 hover:bg-neutral-950" bind:value={payloadModalTextearea} name="" id="" cols="30" rows="16"></textarea>
                
                {#if runFlowMessage.message !== ''}
                    <span class={`${ runFlowMessage.type === 'error' ? 'text-red-600' : 'text-green-600' } mt-4`}>
                            <i class="ti ti-exclamation-circle text-lg mr-2 align-middle"></i>
                            { runFlowMessage.message }
                    </span>
                {/if}
    
                
                <div class="console_screen mt-4 items-center overflow-hidden">
                    {#if Object.values($LOGGER.messages).length > 0}
                        <span class="whitespace-nowrap mr-1 font-code">Last message:</span>
                        <LogMessage data={Object.values($LOGGER.messages).slice(-1)[0]} />
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
                        Update UI
                    </button>
                </div>
            </section>
        {:else if activeTab === 'console'}
            <section transition:slide={{ duration: 400 }}>
                <button class="clear-btn mb-2" on:click={() => openDangerModal(LOGGER.clearLogs, { danger_modal_title: 'Clear logs from Local Storage?', danger_confirm: 'Clear' })}>Clear logs</button>
                <div class="console_screen flex-col-reverse overflow-y-auto overflow-x-clip max-h-[36rem]">
                    {#each Object.entries($LOGGER.messages).reverse() as [msg_key, msg], _ (msg_key)}
                        <!-- <span>{ JSON.stringify(msg, null, 3) }</span> -->
                        <LogMessage on:clipboard_copy={() => appendModalToast('Copied to clipboard!', 'success')} data={msg} />
                    {/each}
                </div>
            </section>
        {:else if activeTab === 'response payload'}
            <section transition:slide={{ duration: 400 }}>
                <div class="max-h-[36rem] overflow-y-auto rounded-md">
                    <GraphicalJson key="response_payload" values={ JSON.parse(responsePayload) }/>
                </div>
                <!-- <textarea class="font-code bg-neutral-950 hover:bg-neutral-950" bind:value={responsePayload} name="" id="" cols="30" rows="20"></textarea> -->
            </section>
        {/if}
    </TabsBar>
</Modal>