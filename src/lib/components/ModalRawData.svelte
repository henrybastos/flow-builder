<script>
    import Modal from "./Modal.svelte";

    /** @type {boolean} */
    export let _rawDataModalCloseOnParse = true;

    export let inputsCollection;

    /** @type {Object} */
    export let rawDataTemplate;

    export let modalRawData;
    
    let rawDataJson;

    function injectRawData () {
        // Removes CR_LF and Whitespace from Textarea input value and parses it
        const _dataToInject = JSON.parse(rawDataJson.value.replaceAll(/[\n\t\s]/g, ''));

        Object.keys(_dataToInject).forEach(_key => {
            inputsCollection[_key].value = _dataToInject[_key];
            inputsCollection = inputsCollection;
        });

        rawDataTemplate = _dataToInject;
        modalRawData.close();
    }

    export function open () {
        modalRawData.open();
    }

    export function close () {
        modalRawData.close();
    }
</script>

<Modal bind:this={modalRawData} title="Modal">
    <div class="grow">
       <textarea readonly bind:this={rawDataJson} class="h-full" name="" id="" cols="30" rows="10">{ JSON.stringify(rawDataTemplate, null, 3) }</textarea>
    </div>
    <div class="mt-4">
       <button class="btn-sm mr-3" on:click={modalRawData.close}>Close</button>
       <!-- <button class="btn-sm mr-3" on:click={injectRawData}>Inject Raw Data</button> -->
    </div>
 </Modal>