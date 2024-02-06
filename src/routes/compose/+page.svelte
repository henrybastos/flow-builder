<script>
    import * as Card from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import DraggableList from "$lib/components/DraggableList.svelte";
    import EnvPanel from "./EnvPanel.svelte";
    import { FlowBlocks } from "$lib/flow-blocks/FlowBlocks";
    import { initStruct } from "$lib/PayloadStore";
    import { onMount } from "svelte";
    import { ServerHandler } from "$lib/ServerHandler";
    import { LOGGER, TAGS } from "$lib/LogStore";

    let isFlowBlockPanelOpen = false;
    let isEnvPanelOpen = false;
    let isAddFlowBlockOpen = false;

    let currentFlowBlock = {
        title: '',
        block_id: '',
        description: '',
        payload: {}
    }

    let combinedPayload = {};

    function combineAllPayloads () {
        let fullPayload = {};

        function _combineEnv () {
            for (let block of flowBlocksClone) {
                fullPayload.env = {
                    ...(fullPayload.env),
                    ...(block.payload.env)
                }
            }
        }

        function _combineFlows () {
            fullPayload.flows = {};
            fullPayload.flows.main_flow = [];

            for (let block of flowBlocksClone) {
                fullPayload.flows.main_flow = [
                    ...(fullPayload.flows.main_flow),
                    ...(block.payload.flows.main_flow)
                ]
            }

            for (let block of flowBlocksClone) {
                for (let [flow_name, flow_ops] of Object.entries(block.payload.flows)) {
                    fullPayload.flows = {
                        ...(fullPayload.flows),
                        [flow_name]: flow_ops
                    }
                }
            }
        }
        
        _combineEnv()
        _combineFlows()
        fullPayload.config = initStruct.config;
        return structuredClone(fullPayload);
    }

    function openFlowBlockDialog (item) {
        currentFlowBlock = item;
        isFlowBlockPanelOpen = true;
    }

    function openCombinedBlocksDialog () {
        combinedPayload = {
            title: 'Carga final',
            block_id: '0a9bd0cd-4535-4271-bc83-705a807c2f1e',
            description: 'Todos os blocos combinados. Serão executados sequencialmente.'
        };

        combinedPayload.payload = combineAllPayloads();

        if (combinedEnvPayload) {
            for (let [field_name, field_value] of Object.entries(combinedEnvPayload)) {
                combinedPayload.payload.env[field_name] = field_value.value;
            }
        }
        openFlowBlockDialog(combinedPayload);
    }

    function openEnvPanel () {
        for (let block of FlowBlocks) {
            combinedEnvPayload = {
                ...(combinedEnvPayload),
                ...(block.env_payload)
            }
        }

        isEnvPanelOpen = true;
    }

    let flowBlocksClone = structuredClone(FlowBlocks);
    let combinedEnvPayload = {};

    onMount(() => {
        // document.querySelector('body').addEventListener('wheel', () => {
        //     console.log('Wheeling')
        // })
        // window.onwheel = () => console.log('Wheeling');
    })

    ServerHandler.logger = LOGGER;
    ServerHandler.logger_tags = TAGS;

    async function runCombinedPayload () {
        combinedPayload = combineAllPayloads();
        await ServerHandler.sendFlowPayload(combinedPayload);
    }
</script>

<svelte:head>
    <title>Flow Builder • Compose</title>
</svelte:head>

<Card.Root class="flex flex-col p-3 border border-neutral-800 rounded-lg w-[40rem]">
    <Card.Header class="p-1 mb-3">
        <Card.Title class="text-2xl text-left flex justify-between">Carga combinada</Card.Title>
        <!-- <Card.Description class="text-base">{ item.description }</Card.Description> -->
    </Card.Header>

    <Card.Content class="border border-neutral-800 rounded-lg p-3 mb-3">
        <DraggableList bind:itemsList={flowBlocksClone} let:item class="flex flex-col gap-y-3">
            <Card.Root class="rounded-lg">
                <Card.Header class="p-4">
                    <Card.Title class="text-xl text-left flex justify-between">
                        { item.title }
                        <Button on:click={() => openFlowBlockDialog(item)} variant="outline" size="icon"><i class="ti ti-code text-neutral-500"></i></Button>
                    </Card.Title>
                    <Card.Description class="text-base">{ item.description }</Card.Description>
                </Card.Header>
            </Card.Root>
        </DraggableList>
    
        <Button class="mt-3 w-full" variant="ghost">
            <i class="ti ti-plus"></i>
        </Button>
    </Card.Content>

    <Card.Footer class="grid grid-cols-2 gap-y-2 gap-x-2 p-0">
        <Button variant="outline" class="text-base col-span-1" on:click={openCombinedBlocksDialog}>Carga final</Button>
        <Button variant="outline" class="text-base col-span-1" on:click={openEnvPanel}>Painel de Variáveis</Button>
        <Button class="text-base col-span-2" on:click={runCombinedPayload}>Executar blocos</Button>
    </Card.Footer>
</Card.Root>

<Dialog.Root bind:open={isFlowBlockPanelOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title>
                { currentFlowBlock.title }
                {#if currentFlowBlock.block_id}
                    <span class="text-neutral-500 font-code text-base pl-2">{ currentFlowBlock.block_id }</span>
                {/if}
            </Dialog.Title>
            <Dialog.Description>{ currentFlowBlock.description }</Dialog.Description>
        </Dialog.Header>

        <pre class="max-h-[80vh] overflow-y-auto border border-neutral-700 rounded-lg p-4 font-code">{ JSON.stringify(currentFlowBlock.payload, null, 3) }</pre>
    </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={isAddFlowBlockOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title>
                { currentFlowBlock.title }
                {#if currentFlowBlock.block_id}
                    <span class="text-neutral-500 font-code text-base pl-2">{ currentFlowBlock.block_id }</span>
                {/if}
            </Dialog.Title>
            <Dialog.Description>{ currentFlowBlock.description }</Dialog.Description>
        </Dialog.Header>

        <pre class="max-h-[80vh] overflow-y-auto border border-neutral-700 rounded-lg p-4 font-code">{ JSON.stringify(currentFlowBlock.payload, null, 3) }</pre>
    </Dialog.Content>
</Dialog.Root>

<EnvPanel bind:combinedEnvPayload={combinedEnvPayload} bind:isEnvPanelOpen={isEnvPanelOpen} />