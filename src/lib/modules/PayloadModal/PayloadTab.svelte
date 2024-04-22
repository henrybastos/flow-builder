<script>
    import { onMount } from "svelte";
    import { slide } from "svelte/transition";
    import { ServerHandler } from "$lib/ServerHandler";
    import { createEventDispatcher } from "svelte";
    import { FLOW_BUILDER_OPERATION_TEMPLATES } from "$lib/OperationTemplates";
    import { LOGGER, TAGS } from "$lib/LogStore";
    import { CURRENT_PRESET_NAME } from "$lib/PresetsStore";
    import { PAYLOAD } from "$lib/PayloadStore";
    import LogMessage from "$lib/components/LogMessage.svelte";
    import CodeMirrorModule from "../CodeMirrorModule/CodeMirrorModule.svelte";

    export let showToast;
    export let payloadModal;
    export let payloadModalTextearea;    

    let dispatch = createEventDispatcher();
    let isUserDragginFileOver;

    $: payloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(payloadModalTextearea) }`;
    $: payloadURIPresetName = `${ $CURRENT_PRESET_NAME?.match(/[A-z,0-9]*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;
    $: rawPayloadToURI = `data:text/json;charset=utf-8,${ encodeURIComponent(JSON.stringify($PAYLOAD, null, 3)) }`;
    $: rawPayloadURIPresetName = `raw_${ $CURRENT_PRESET_NAME?.match(/\w*[^\s:_,.]/gi)?.join('_')?.toLowerCase() || 'preset' }.json`;
    $: ServerHandler.currentPresetName = $CURRENT_PRESET_NAME;

    ServerHandler.logger = LOGGER;
    ServerHandler.logger_tags = TAGS;

    onMount(async () => {
        PAYLOAD._fix_fixNullConfig();
    });

    function loadPayload () {
        try {
            JSON.parse(payloadModalTextearea);
        } catch (err) {
            showToast('Invalid JSON. Impossible to parse.', 'error');
            return;
        }

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

        payloadModalTextearea = JSON.stringify($PAYLOAD, null, 3);
        payloadModal.close();
        dispatch('payload_loaded');
    }

    function onFileDropped (_evt) {
        const [file] = _evt.dataTransfer.files;

        if (file?.type.match('application/json')) {
            let reader = new FileReader();
            reader.onloadend = function() {
                // Trick to adjust tab identation size to always 3 spaces.
                payloadModalTextearea = JSON.stringify(JSON.parse(this.result), null, 3);
                showToast(`File ${ file.name } loaded!`, 'success');
            };
            reader.readAsText(file);
        } else {
            showToast('Not a JSON file.', 'error');
        }

        isUserDragginFileOver = false;
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
    </div>

    <!-- on:drop|preventDefault={onFileDropped} 
    on:dragover|preventDefault={() => isUserDragginFileOver = true} 
    on:dragleave={() => isUserDragginFileOver = false} -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
        class="h-[30rem] max-h-[30rem] relative w-full overflow-x-clip overflow-y-auto border-neutral-800 border-2 rounded-md"
        class:wrapperOnDragOver={isUserDragginFileOver}
        
    >
        <!-- <div class="absolute invisible grid place-items-center bg-black bg-opacity-75 -inset-2" class:onDragOver={isUserDragginFileOver} on:dragleave={() => isUserDragginFileOver = false}>
            <h4>Drop file in here</h4>
        </div> -->

        <CodeMirrorModule bind:value={payloadModalTextearea}/>

        <!-- <textarea 
            class="font-code border-none rounded-none -mb-2 bg-neutral-950 w-[105%] h-full" 
            bind:value={payloadModalTextearea} 
            cols="30" rows="16"
        ></textarea> -->
    </div>

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
            <button disabled={ServerHandler.isRequestCanceled} on:click={async () => await ServerHandler.closeBrowser()} class="btn-md w-full mt-4">
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

<style lang="postcss">
    .onDragOver {
        @apply visible pointer-events-none;
    }

    .wrapperOnDragOver {
        @apply border-blue-500 border-dashed;
    }
</style>