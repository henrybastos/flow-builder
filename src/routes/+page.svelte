<script>
    import '../app.css';
    import { PAYLOAD } from "$lib/PayloadStore";

    // import LetTest from '$lib/components/LetTest.svelte';
    import Modal from "$lib/components/Modal.svelte";
    import PresetsModal from '$lib/components/PresetsModal.svelte';
    import PayloadModal from '$lib/components/PayloadModal.svelte';
    import AddFlowModal from '$lib/components/AddFlowModal.svelte';
    import ToastsWrapper from "$lib/components/ToastsWrapper.svelte";
    import Flow from '$lib/components/Flow.svelte';
    import { onMount } from 'svelte';
    import { FLOW_PRESETS } from '$lib/PresetsStore';

    let pageSettingsModal;
    let appendToast;

    onMount(() => {
        if (localStorage?.getItem('temp_preset')) {
            PAYLOAD.loadPayload(JSON.parse(localStorage.getItem('temp_preset')));
        }
        if (localStorage?.getItem('presets')) {
            try {
                FLOW_PRESETS.loadPresets(JSON.parse(localStorage.getItem('presets')));
                appendToast('Presets loaded successfully!', 'success');
            } catch (err) {
                console.error(err);
                console.error(`[ERR] Invalid presets strucuture.`);
                appendToast('[ERR] Invalid presets strucuture.', 'error');
            }
        } else {
            appendToast('No presets found :(', 'error');
        }
    });

    async function fetchAndAttach () {
        console.log('AAAA');
        const decoder = new TextDecoder();

        fetch('http://localhost:5001/stream', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic k3b00k#vip@dev'
            },
        }).then((res) => {
            const reader = res.body.getReader();

            console.log('Fetching...');

            reader.read().then(function readStream ({ done, value }) {
                if (done) {
                    console.log('[done]');
                    return;
                }

                console.log(decoder.decode(value));
                return reader.read().then(readStream);
            });
        });
        console.log('BBBB');
    }

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

    // let id_arr = [
    //     'id_001',
    //     'id_002'
    // ]
</script>


<!-- ============================== -->


<svelte:head>
    <title>KMT • Flow Builder</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css">
</svelte:head>

<main class="flex flex-col w-[600px]">
    <header class="flex flex-col my-10">
        <h2 class="m-0">Flow Builder</h2>
        <p class="text-center text-neutral-500">Powered by Tailwind, SvelteKit and Puppeteer</p>
    </header>

    <!-- <button class="btn-md" on:click={fetchAndAttach}>Fetch And Attach</button> -->

    <!-- {#each id_arr as item_id}
        <LetTest let:sayId id={item_id}>
            <button class="btn-md" on:click={sayId}>Bark 🐶</button>
        </LetTest>
    {/each} -->

    <div class="btn-bar">
        <PresetsModal {appendToast}/>

        <button on:click={() => pageSettingsModal.open()} class="btn-md btn-full col-span-full">
            <i class="ti ti-adjustments-horizontal text-blue-500"></i>
            Page Settings
        </button>
        <AddFlowModal />
    </div>

    {#each Object.keys($PAYLOAD.flows) as flow_name}
        <Flow flowName={flow_name} />
    {/each}

    <PayloadModal />

    <Modal bind:this={pageSettingsModal} title="Page Settings">
        <div class="btn-bar">
            <button on:click={clearTempPresetToLocalStorage} class="btn-sm btn-danger w-full">
                <i class="ti ti-database-x"></i>
                Clear Local Storage
            </button>

            <button on:click={saveTempPresetToLocalStorage} class="btn-sm btn-full">
                <i class="ti ti-device-floppy text-blue-500"></i>
                Save to Local Storage
            </button>
        </div>
    </Modal>
    
    <ToastsWrapper bind:appendToast={appendToast}/>
</main>

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