<script>
    import { PAYLOAD } from "$lib/PayloadStore";
    import Modal from "./Modal.svelte";
    import Switch from "./Switch.svelte";

    export let appendToast;
    let pageSettingsModal;
    // $: wsEndpoint = $PAYLOAD.config.ws_endpoint || '';
    let wsEndpoint = '';

    function saveTempPresetToLocalStorage () {
        try {
            localStorage?.setItem('temp_preset', JSON.stringify($PAYLOAD));
            appendToast('Temp Preset saved!', 'success');
        } catch (err) {
            appendToast('Failed to save Temp Preset', 'error');
            console.error(err);
        }
    }

    function clearTempPresetToLocalStorage () {
        if (localStorage?.getItem('temp_preset')) {
            localStorage.removeItem('temp_preset');
        }
    }

    function updateWSEnpoint () {
        PAYLOAD.setConfig('ws_endpoint', wsEndpoint);
    }

    function updateCloseBrowserOnFinish ({ detail }) {
        PAYLOAD.setConfig('close_browser_on_finish', detail);
        console.log($PAYLOAD);
    }
</script>

<button on:click={() => pageSettingsModal.open()} class="btn-md">
    <i class="ti ti-settings text-blue-500"></i>
    Settings
</button>

<Modal bind:this={pageSettingsModal} title="Settings">
    <div class="btn-bar">
        <button on:click={clearTempPresetToLocalStorage} class="btn-sm btn-danger w-full">
            <i class="ti ti-database-x"></i>
            Clear Local Storage
        </button>

        <button on:click={saveTempPresetToLocalStorage} class="btn-sm btn-full">
            <i class="ti ti-device-floppy text-blue-500"></i>
            Save to Local Storage
        </button>
    
        <div class="grid grid-cols-[min-content_auto] gap-y-3 col-span-full w-full">
            <label class:ws-active-label={wsEndpoint} class="col-start-1 col-end-2 whitespace-nowrap mr-4 my-auto transition-all" for="ws_input">Web Socket Endpoint</label>
            <input on:change={updateWSEnpoint} bind:value={wsEndpoint} name="ws_input" class:ws-active-label={wsEndpoint} class="input-md grow" type="text" placeholder="ws://123.456.789">

            <span class="col-span-full">
                <Switch on:toggle={updateCloseBrowserOnFinish} label="Close browser on finish" />
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