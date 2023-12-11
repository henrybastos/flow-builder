<script>
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { ServerHandler } from "$lib/ServerHandler";
    import { FLOW_PRESETS } from "$lib/PresetsStore";
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/store";
    import { LOGGER, TAGS } from "$lib/LogStore";
    import { CURRENT_PRESET_NAME } from "$lib/PresetsStore";
    import { PAYLOAD } from "$lib/PayloadStore";
    import LogMessage from "$lib/components/LogMessage.svelte";
    import { transformToJSON } from "$lib/utils";

    let payloadModalTextearea;    

    $: payloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(payloadModalTextearea) }`;
    $: payloadURIPresetName = `${ $CURRENT_PRESET_NAME?.match(/[A-z,0-9]*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;
    $: rawPayloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify($PAYLOAD)) }`;
    $: rawPayloadURIPresetName = `raw_${ $CURRENT_PRESET_NAME?.match(/\w*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;
    $: ServerHandler.currentPresetName = $CURRENT_PRESET_NAME;

    ServerHandler.logger = LOGGER;
    ServerHandler.logger_tags = TAGS;

    onMount(() => {
        PAYLOAD._fix_fixNullConfig();
        payloadModalTextearea = transformToJSON($PAYLOAD);
    });

    function encodePresetsToURI () {
        FLOW_PRESETS._fix_fixNullConfigForAll()
        let _payload_list_json = structuredClone($FLOW_PRESETS);
        
        _payload_list_json = Object.entries(_payload_list_json).map(([ preset_name, preset_payload ]) => {
            return [preset_name, JSON.parse(transformToJSON(preset_payload))]
        })

        console.log(_payload_list_json);
        
        return encodeURIComponent(JSON.stringify(Object.fromEntries(_payload_list_json), null, 3));
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

        payloadModal.close();
    }
</script>

<section transition:slide={{ duration: 400 }}>
    <div class="inline-flex justify-start">
        <a class="clear-btn mb-2" href={payloadToURI} download={payloadURIPresetName}>
            Download payload
        </a>

        <a class="clear-btn mb-2" href={rawPayloadToURI} download={rawPayloadURIPresetName}>
            Download raw payload
        </a>

        <!-- <a class="clear-btn mb-2" 
            href={`data:text/json;charset=utf-8,${ encodePresetsToURI() }`} 
            download={'all_presets.json'}>
            Download raw full payload
        </a> -->
    </div>

    <textarea class="font-code bg-neutral-950 hover:bg-neutral-950" bind:value={payloadModalTextearea} name="" id="" cols="30" rows="16"></textarea>
    
    <div class="console_screen mt-4 items-center overflow-hidden">
        {#if Object.values($LOGGER.messages).length > 0}
            <span class="whitespace-nowrap mr-1 font-code">Last message:</span>
            <LogMessage data={Object.values($LOGGER.messages).slice(-1)[0]} />
        {:else}
            <span class="text-neutral-500">Nothing to see here =)</span>
        {/if}
    </div>

    <div class="btn-bar">
        {#if ServerHandler.isFLowAPILoading}
            <button disabled={ServerHandler.isRequestCanceled} on:click={() => ServerHandler.isRequestCanceled = true} class="btn-md w-full mt-4">
                <span class="w-full inline-flex justify-center">
                    {#if ServerHandler.isRequestCanceled}
                        <i class="ti ti-loader-2 text-neutral-400 animate-spin-icon mr-2"></i>
                        Canceling request
                    {:else}
                        <i class="ti ti-loader-2 text-neutral-400 animate-spin-icon mr-2"></i>
                        Cancel
                    {/if}
                </span>
            </button>
        {:else }
            <button on:click={async () => await ServerHandler.sendFlowPayload(payloadModalTextearea)} class="btn-md w-full mt-4">
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