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

    const controller = new AbortController();
    $: payloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(payloadModalTextearea) }`;
    $: payloadURIPresetName = `${ $CURRENT_PRESET_NAME?.match(/[A-z,0-9]*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;

    let responsePayload = JSON.stringify({ response: 'Nothing to display :D' });

    let testObj = {
        "videos_PLAYLIST MEGA FUNK": [
            "MEGA SE PREPARA 2 SETEMBRO (DJ JONATAS FELIPE)",
            "MEGA DINGO BELL 2019 (ALBINO)",
            "MEGA É SÓ BOTADÃO (ALBINO)",
            "MEGA 38 CARREGADO 2020 (ALBINO)",
            "MEGA KIKA DE NOVO (ALBINO)",
            "MEGA COCOTA 2019 (ALBINO)",
            "MEGA QUEM GOSTA (DJ THIAGO SC & DJ JONATAS FELIPE)",
            "MEGA ÁGUA COCA LATÃO (DJ JONATAS FELIPE)",
            "MEGA OH JULIANA (ALBINO)",
            "MEGA COMPREI UM LANÇA (ALBINO & FRACARI)",
            "MEGA FUNK - BOTA PRA TREMER (DJ Magdiel PR)",
            "MEGA ENTÃO TOMA - DJ THIAGO SC",
            "MEGA FUNK DO HELICÓPTERO (DJ DUDU VIEIRA & DJ JONATAS FELIPE) 2019",
            "MEGA AI DROGA 2019 (ALBINO)",
            "MEGA VAI LUAN 2020 (ALBINO)",
            "MEGA RITMADO 4.0 2020 (ALBINO)",
            "MEGA BANHO DE CHUVA 2019 (ALBINO)",
            "MEGA EMPURRA EMPURRA 2020 (ALBINO)",
            "MEGA SOCA COM PRESSÃO (ALBINO)",
            "MEGA NAMORAR NÃO DA - JUNHO 2019 (ALBINO)",
            "MEGA SENTADÃO 2019 (ALBINO)",
            "MEGA FUNK SEM DIREITOS AUTORAIS DE MARÇO VOL 2 DJ MIKA3L CWB",
            "MEGA FURACÃO 2000 (DJ JONATAS FELIPE)"
        ],
        "videos_100 Best Rock Songs of 2000's": [
            "Mudvayne - Happy? (Official HD Video)",
            "System Of A Down - Chop Suey! (Official HD Video)",
            "@officialsevendust - Enemy (Official Music Video)",
            "Slipknot - Duality [OFFICIAL VIDEO] [HD]",
            "All That Remains - Two Weeks (Official Music Video)",
            "Rise Against - Savior (Official Music Video)",
            "Red Hot Chili Peppers - Dani California [Official Music Video]",
            "Five Finger Death Punch - \"Hard to See\" Prospect Park Records - Official Music Video",
            "Evanescence - Bring Me To Life (Official Music Video)",
            "In The End [Official HD Music Video] - Linkin Park",
            "Paramore: crushcrushcrush [OFFICIAL VIDEO]",
            "Papa Roach - Lifeline (Official Music Video)",
            "Alter Bridge - Ties That Bind",
            "Breaking Benjamin - So Cold",
            "Incubus - Drive",
            "Taproot - Poem (Official Video)",
            "Trapt - Headstrong (Official Music Video) | Warner Vault",
            "Limp Bizkit - Rollin' (Air Raid Vehicle)",
            "Skillet - Monster (Official Video)",
            "Mudvayne - Not Falling (Revised Version) (Official Video)",
            "Story Of The Year - The Antidote",
            "Killswitch Engage - My Curse [OFFICIAL VIDEO]",
            "Foo Fighters - The Pretender",
            "Korn - Falling Away from Me (Official HD Video)",
            "Tenacious D - Tribute (Official Video)",
            "System Of A Down - B.Y.O.B. (Official HD Video)",
            "Foo Fighters - Best Of You (Official Music Video)",
            "A Day To Remember - The Downfall of Us All (Official Video)",
            "Three Days Grace - Animal I Have Become",
            "Rise Against - Re-Education (Through Labor)",
            "Hinder - Lips Of An Angel (Official Music Video)",
            "Deftones - Diamond Eyes [Official Music Video]",
            "P.O.D. - Youth of the Nation (Official Music Video) [HD]",
            "AFI - Medicate (Official Music Video)",
            "P.O.D. Alive (Rocky)",
            "Static-X - The Only (Official Music Video) | Warner Vault",
            "Chevelle - The Red (Official HD Video)",
            "Staind - Right Here (Official Video)",
            "Still Frame",
            "Rammstein - Sonne (Official Video)",
            "Ill Nino - How Can I Live [OFFICIAL VIDEO]",
            "Drowning Pool - Tear Away",
            "To Defy the Laws of Tradition",
            "Better",
            "Cold (But I'm Still Here) from Evans|Blue",
            "A Day To Remember - I'm Made of Wax, Larry, What Are You Made Of? (Official Video)"
        ]
    }

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
        console.log($PAYLOAD);
        if (localStorage.getItem('logs')) {
            LOGGER.loadLogs(localStorage.getItem('logs'));
        }
        if (localStorage.getItem('last_ws_endpoint')) {
            lastWSEndpoint = localStorage.getItem('last_ws_endpoint');
        }
    })

    function transformToJSON (_payload) {
        let payloadBuffer = structuredClone(_payload);
        Object.entries(payloadBuffer.flows).forEach(([flow_name, flow_body]) => {
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
        });
        return JSON.stringify(payloadBuffer, null, 3);
    }

    function encodePresetsToURI () {
        FLOW_PRESETS._fix_fixNullConfigForAll()
        let _payload_list_json = structuredClone($FLOW_PRESETS);
        _payload_list_json = Object.entries(_payload_list_json).map(([ preset_name, preset_payload ]) => {
            return [preset_name, JSON.parse(transformToJSON(preset_payload))]
        })
        
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
            console.log($LOGGER);
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

        if (payloadJSON.config) {
            PAYLOAD.loadConfig(payloadJSON.config);
        } else {
            PAYLOAD._fix_fixNullConfig();
        }

        payloadModal.close();
    }

    function onPayloadModalOpenHandler () {
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

            <div class="inline-flex justify-start">
                <a class="clear-btn mb-2" 
                    href={payloadToURI} 
                    download={payloadURIPresetName}>
                    Download payload
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
        {:else if activeTab === 'console'}
            <button class="clear-btn mb-2" on:click={() => openDangerModal(LOGGER.clearLogs, { danger_modal_title: 'Clear logs from Local Storage?', danger_confirm: 'Clear' })}>Clear logs</button>
            <div class="console_screen flex-col overflow-y-auto max-h-[36rem]">
                {#each Object.entries($LOGGER.messages) as [msg_key, msg], _ (msg_key)}
                    <!-- <span>{ JSON.stringify(msg, null, 3) }</span> -->
                    <LogMessage on:clipboard_copy={() => appendModalToast('Copied to clipboard!', 'success')} data={msg} />
                {/each}
            </div>
        {:else if activeTab === 'response payload'}
            <div class="max-h-[36rem] overflow-y-auto rounded-md">
                <GraphicalJson key="response_payload" values={ testObj }/>
            </div>
            <!-- <GraphicalJson key="response_payload" values={ JSON.parse(responsePayload) }/> -->
            <!-- <textarea class="font-code bg-neutral-950 hover:bg-neutral-950" bind:value={responsePayload} name="" id="" cols="30" rows="20"></textarea> -->
        {/if}
    </TabsBar>
</Modal>