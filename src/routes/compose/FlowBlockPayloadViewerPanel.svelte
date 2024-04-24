<script>
    import Clipboard from "$lib/components/Clipboard.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";

    export let flowBlock;
    export let toast;
    export let isPanelOpen = false;

    const defaultBlock = {
        flows: {
            main_flow: [],
        },
        config: {
            ws_endpoint: false,
            close_browser_on_finish: false,
            close_browser_on_cancel_request: false,
            headless: true,
        },
    };

    $: clipboardContent = JSON.stringify(flowBlock.payload, null, 3);

    $: {
        if (Object.keys(flowBlock).length === 0) {
            flowBlock = defaultBlock;
        }
    }
</script>

<Dialog.Root bind:open={isPanelOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title class="text-xl">
                {flowBlock.title}
                {#if flowBlock.block_id}
                    <span class="text-neutral-500 font-code text-base pl-2"
                        >{flowBlock.block_id}</span
                    >
                {/if}
            </Dialog.Title>
            <Dialog.Description class="text-base"
                >{flowBlock.description}</Dialog.Description
            >
        </Dialog.Header>

        <pre
            class="max-h-[80vh] overflow-y-auto border border-neutral-700 rounded-lg p-4 font-code">{ JSON.stringify(flowBlock.payload, null, 3) }</pre>

        <Dialog.Footer class="flex flex-row-reverse gap-x-2">
            <Clipboard let:copyToClipboard bind:clipboardContent={clipboardContent} {toast}>
                <Button variant="default" on:click={copyToClipboard}>
                    Copiar saída
                </Button>
            </Clipboard>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
