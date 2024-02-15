<script>
    import { PAYLOAD } from "$lib/PayloadStore";
    import { onMount } from "svelte";
    import Modal from "../components/Modal.svelte";
    import Switch from "../components/Switch.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    export let showGlobalToast;
    export let wsEndpoint;

    let showDanger;
    let pageSettingsModal;
    let lastWSEndpoint;

    onMount(() => {
        if (localStorage.getItem('last_ws_endpoint')) {
            lastWSEndpoint = localStorage.getItem('last_ws_endpoint');
            wsEndpoint = lastWSEndpoint;
            PAYLOAD.setConfig('ws_endpoint', lastWSEndpoint);
        }
    })

    function saveTempPreset () {
        try {
            localStorage.setItem('temp_preset', JSON.stringify($PAYLOAD));
            localStorage.setItem('last_ws_endpoint', wsEndpoint || '');
            showGlobalToast('Temp Preset saved!', 'success');
        } catch (err) {
            showGlobalToast('Failed to save Temp Preset', 'error');
            console.error(err);
        }
    }

    function updateWSEnpoint () {
        // wsEndpoint = $PAYLOAD?.config?.ws_endpoint || '';
        PAYLOAD.setConfig('ws_endpoint', wsEndpoint);
    }

    function updateCloseBrowserOnFinish ({ detail }) {
        PAYLOAD.setConfig('close_browser_on_finish', detail);
    }

    function updateCloseBrowserOnCancelRequest ({ detail }) {
        PAYLOAD.setConfig('close_browser_on_cancel_request', detail);
    }

    function openModal () {
        pageSettingsModal.open();
    }

    function clearLogs () {
        showDanger(() => {
            localStorage.removeItem('logs');
        }, { danger_modal_title: 'Clear logs?' });
    }

    function clearPresets () {
        showDanger(() => {
            localStorage.removeItem('temp_preset');
            localStorage.removeItem('last_ws_endpoint');
        }, { danger_modal_title: 'Clear local storage?' })
    }

    function preventFromClosingPage () {
        PAYLOAD.setConfig('prevent_from_closing', detail);
    }

    function toggleHeadlessMode ({ detail }) {
        PAYLOAD.setConfig('headless', detail) 
    }
</script>

<Button variant="secondary" on:click={openModal}>
    <i class="ti ti-settings text-blue-500 mr-2"></i>
    Settings
</Button>

<Modal bind:this={pageSettingsModal} title="Settings" bind:showDanger>
    <div class="btn-bar">
        <button on:click={clearPresets} class="btn-sm btn-danger w-full">
            <i class="ti ti-database-x"></i>
            Clear Temp Preset?
        </button>

        <button on:click={clearLogs} class="btn-sm btn-danger btn-full">
            <i class="ti ti-message-x"></i>
            Clear logs
        </button>

        <button on:click={saveTempPreset} class="btn-sm col-span-full btn-full">
            <i class="ti ti-device-floppy text-blue-500"></i>
            Save to Temp Preset
        </button>
    
        <div class="grid grid-cols-[min-content_auto] gap-y-3 col-span-full w-full">
            <label class:ws-active-label={wsEndpoint} class="col-start-1 col-end-2 whitespace-nowrap mr-4 my-auto transition-all" for="ws_input">Web Socket Endpoint</label>
            <input on:change={updateWSEnpoint} bind:value={wsEndpoint} name="ws_input" class:ws-active-label={wsEndpoint} class="input-md grow" type="text" placeholder="ws://123.456.789">

            <span class="col-start-1 col-end-2 whitespace-nowrap mr-4 my-auto transition-all text-lg">Close browser on finish</span>
            <span class="inline-flex gap-x-3">
                <Switch disabled={$PAYLOAD.config.ws_endpoint}  on:toggle={updateCloseBrowserOnFinish} />
                {#if $PAYLOAD.config.ws_endpoint}
                    <p class="text-neutral-400">Cannot auto-close browser while using a Web Socket endpoint.</p>
                {/if}
            </span>
            
            <span class="col-start-1 col-end-2 whitespace-nowrap mr-4 my-auto transition-all text-lg">Close browser on Cancel Request</span>
            <span class="inline-flex gap-x-3">
                <Switch disabled={$PAYLOAD.config.ws_endpoint}   on:toggle={updateCloseBrowserOnCancelRequest} />
                {#if $PAYLOAD.config.ws_endpoint}
                    <p class="text-neutral-400">Cannot auto-close browser while using a Web Socket endpoint.</p>
                {/if}
            </span>

            <span class="col-start-1 col-end-2 whitespace-nowrap mr-4 my-auto transition-all text-lg">Prevent user from closing the page</span>
            <span class="inline-flex gap-x-3">
                <Switch on:toggle={preventFromClosingPage} />
                <!-- {#if $PAYLOAD.config.ws_endpoint}
                    <p class="text-neutral-400">User already can't close the browser due to Web Socket usage.</p>
                {/if} -->
            </span>
            
            <span class="col-start-1 col-end-2 whitespace-nowrap mr-4 my-auto transition-all text-lg">Headless mode</span>
            <span class="inline-flex gap-x-3">
                <Switch checked={$PAYLOAD.config.headless} on:toggle={toggleHeadlessMode} />
            </span>
        </div>
    </div>
</Modal>

<style>
    .ws-active-label {
        @apply text-green-500 border-green-500;
    }
</style>

<!-- 
⣿⣿⣿⣿⣿⢯⡫⡣⣏⣎⢮⢮⢣⣫⢹⠯⣿⣿⣽⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣷⢽⢝⢮⢪⢪⢪⢪⢪⣲⢫⣘⢿⣜⡿⣿⢿⣿⣿⣿⣿⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⢳⢱⢵⢱⡱⡵⣱⡛⡎⡽⡸⣕⣗⢯⣟⣯⢯⣟⣿⣿⣿⣿⣿⣿ 
⣿⣿⣿⣿⣿⣿⢱⢭⢮⢓⠭⢪⢒⣹⣺⣺⣻⣽⢾⡿⣽⣶⣽⣹⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⡳⡝⡎⠊⠐⣔⢯⡺⣺⣪⢗⡯⣯⣟⣯⣷⢿⣿⣻⣻⣿⣿⣿⣿
⣿⣿⣿⣿⡿⣻⣺⢽⢽⡂⡜⣎⢧⢫⢮⢪⡳⣝⣞⣞⣗⣯⣿⣻⣟⣯⣿⣿⣿⣿
⣿⣿⣿⣯⡺⡵⡳⡽⡕⠕⡝⡜⡜⡜⡜⡜⡜⡜⣜⢞⡮⡷⣯⢿⣽⢿⣯⣿⣿⣿
⣿⣿⡯⣪⢮⣫⣫⢺⢸⠄⡇⡗⡍⡎⡎⡎⡪⡪⡪⡳⣝⢽⢽⢽⢾⣟⣯⣟⣿⣿
⣿⣟⢪⡺⡜⣖⢵⢹⡐⠅⠑⢕⢕⠕⡕⢜⠌⡆⢕⢕⢕⢯⡫⣯⡻⣞⣯⣿⢹⣿
⣿⡗⡕⡵⡹⡜⡎⡇⡎⢌⠄⠣⡑⡕⡱⡑⢕⠸⡐⡱⡑⡗⣝⢮⣫⢗⠟⡊⢺⣿
⣿⡏⢎⢎⢎⢎⢎⢎⠪⡂⡂⠄⠈⠢⡱⡘⢌⢊⢂⠪⡘⠜⠜⡑⢅⠂⡅⡪⢹⣿
⣿⣿⡥⢑⢅⠣⡑⠅⠑⠄⠄⠂⠠⠐⠐⠈⠄⠁⠂⠁⡀⠄⠡⠨⠄⠑⡠⠨⢸⣿
⣿⣿⡿⠃⠠⠄⡀⢂⠁⠂⠁⠈⢀⠨⠄⠠⠁⠠⠈⠠⠄⠂⢁⠠⢐⠁⢄⠡⣾⣿
⣿⣿⣇⡁⠈⠄⠄⠂⠠⠁⠄⠁⠠⠐⠄⠁⠄⠄⠄⡀⠄⠠⢐⠨⡢⡹⡪⣻⣿⣿
⣿⣿⣿⠨⠐⠄⠄⠄⠄⠄⠄⠄⠄⠄⡀⡁⠄⠂⠁⠄⢀⠡⠠⡑⡜⡜⡵⣽⣿⣿
⣿⣿⣇⡁⠈⠄⠄⠂⠠⠁⠄⠁⠠⠐⠄⠁⠄⠄⠄⡀⠄⠠⢐⠨⡢⡹⡪⣻⣿⣿
-->