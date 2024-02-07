<script>
    import { SvelteComponent, onMount } from "svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Dialog from "$lib/components/ui/dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import DraggableList from "$lib/components/DraggableList.svelte";
    import EnvPanel from "./EnvPanel.svelte";
    import { FlowBlocks } from "$lib/flow-blocks/FlowBlocks";
    import { initStruct } from "$lib/PayloadStore";
    import { ServerHandler } from "$lib/ServerHandler";
    import { LOGGER, TAGS } from "$lib/LogStore";
    import { toast } from "svelte-sonner";
    import LogMessage from "$lib/components/LogMessage.svelte";
    import { page } from "$app/stores";

    let isFlowBlockPanelOpen = false;
    let isEnvPanelOpen = false;
    let isAddFlowBlockOpen = false;
    let isLogsPanelOpen = false;

    let currentFlowBlock = {
        title: '',
        block_id: '',
        description: '',
        payload: {}
    }

    let combinedPayload = {};
    let flowBlocksClone = structuredClone(FlowBlocks);
    let combinedEnvPayload;
    let isPayloadRunning = false;
    
    const DEV_MODE = $page.url.searchParams.has('dev_mode');
    const DEFAULT_ENV_TEST_PAYLOAD = {
        course_home: "https://my.nutror.com/cursos/448082/editar/modulos",
        modules: [
            {
                module_title: "M TEST 1",
                module_lessons: [
                {
                    lesson_title: "A TEST 1",
                    lesson_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                }
                ]
            }
        ],
        login_email: "dev@kebook.com.br",
        login_password: 'yC3-42aXWSt(C"NH'
    }

    ServerHandler.logger = LOGGER;
    ServerHandler.logger_tags = TAGS;

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

            for (let block of flowBlocksClone) {
                for (let [flow_name, flow_ops] of Object.entries(block.payload.flows)) {
                    fullPayload.flows = {
                        ...(fullPayload.flows),
                        [flow_name]: flow_ops
                    }
                }
            }

            fullPayload.flows.main_flow = [];

            for (let block of flowBlocksClone) {
                fullPayload.flows.main_flow = [
                    ...(fullPayload.flows.main_flow),
                    ...(block.payload.flows.main_flow)
                ]
            }
        }
        
        _combineEnv()
        _combineFlows()
        fullPayload.config = initStruct.config;
        fullPayload.config.headless = true;
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

            // Sets all env fields to the default value set on the flow block's payload.
            for (let [env_field, env_value] of Object.entries(block.payload.env)) {
                combinedEnvPayload[env_field].value = env_value
            }
        }

        isEnvPanelOpen = true;
    }

    async function runCombinedPayload () {
        combinedPayload = combineAllPayloads();

        if (DEFAULT_ENV_TEST_PAYLOAD) { 
            combinedPayload.env = DEFAULT_ENV_TEST_PAYLOAD 
            toast.warning("Using DEFAULT_ENV_TEST_PAYLOAD as Env Payload");
        };

        isPayloadRunning = true;
        await ServerHandler.sendFlowPayload(combinedPayload);
        toast.success("Blocos executados.");
        isPayloadRunning = false;
    }
</script>

<svelte:head>
    <title>Flow Builder • Compose</title>
</svelte:head>

<Card.Root class="flex flex-col p-3 border border-neutral-800 rounded-lg w-[40rem]">
    <Card.Header class="p-1 mb-3">
        <Card.Title class="text-2xl text-left flex justify-between">
            Carga combinada
            {#if DEV_MODE}
                <Button on:click={() => isLogsPanelOpen = true} variant="outline" size="icon"><i class="ti ti-list-details text-neutral-500"></i></Button>
            {/if}   
        </Card.Title>
        <!-- <Card.Description class="text-base">{ item.description }</Card.Description> -->
    </Card.Header>

    <Card.Content class="border border-neutral-800 rounded-lg p-3 mb-3">
        <DraggableList bind:itemsList={flowBlocksClone} let:item class="flex flex-col gap-y-3">
            <Card.Root class="rounded-lg">
                <Card.Header class="p-4">
                    <Card.Title class="text-xl text-left flex justify-between">
                        { item.title }
                        {#if DEV_MODE}
                            <Button on:click={() => openFlowBlockDialog(item)} variant="outline" size="icon"><i class="ti ti-code text-neutral-500"></i></Button>
                        {/if}   
                    </Card.Title>
                    <Card.Description class="text-base">{ item.description }</Card.Description>
                </Card.Header>
            </Card.Root>
        </DraggableList>
    
        <Button on:click={() => isAddFlowBlockOpen = true} class="mt-3 w-full" variant="ghost">
            <i class="ti ti-plus"></i>
        </Button>
    </Card.Content>

    <Card.Footer class="grid grid-cols-2 gap-y-2 gap-x-2 p-0">
        <Button variant="outline" class="text-base col-span-1" on:click={openCombinedBlocksDialog}>Carga final</Button>
        <Button variant="outline" class="text-base col-span-1" on:click={openEnvPanel}>Painel de Variáveis</Button>
        {#if isPayloadRunning}
            <Button disabled class="text-base col-span-2" on:click={runCombinedPayload}>
                <i class="ti ti-loader-2 animate-spin mr-2"></i>
                Blocos sendo executados
            </Button>
        {:else}
            <Button class="text-base col-span-2" on:click={runCombinedPayload}>Executar blocos</Button>
        {/if}
    </Card.Footer>
</Card.Root>

<EnvPanel bind:combinedEnvPayload={combinedEnvPayload} bind:isEnvPanelOpen={isEnvPanelOpen} />

<Dialog.Root bind:open={isFlowBlockPanelOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title class="text-xl">
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
            <Dialog.Title class="text-xl">Adicionar bloco</Dialog.Title>
            <Dialog.Description>{ currentFlowBlock.description }</Dialog.Description>
        </Dialog.Header>

        <pre class="max-h-[80vh] overflow-y-auto border border-neutral-700 rounded-lg p-4 font-code">{ JSON.stringify(currentFlowBlock.payload, null, 3) }</pre>
    </Dialog.Content>
</Dialog.Root>

<Dialog.Root bind:open={isLogsPanelOpen}>
    <Dialog.Content class="max-w-[90vw]">
        <Dialog.Header>
            <Dialog.Title class="text-xl">Logs</Dialog.Title>
            <Dialog.Description>{ currentFlowBlock.description }</Dialog.Description>
        </Dialog.Header>

        <div class="console_screen flex-col-reverse overflow-y-auto overflow-x-clip max-h-[36rem] border">
            {#each Object.entries($LOGGER.messages).reverse() as [msg_key, msg], _ (msg_key)}
                <!-- <span class="flex flex-row p-3 bg-blue-500">{ msg.time } • { msg.tag.label } { msg.message }</span> -->
                <LogMessage on:clipboard_copy={() => showToast('Copied to clipboard!', 'success')} data={msg} />
            {/each}

        </div>

        {#if isPayloadRunning}
            <p class="font-code font-semibold text-neutral-500"><i class="inline-flex w-fit h-fit ti ti-loader-2 animate-spin mr-1"></i> Processing operations...</p>
        {:else}
            <p class="font-code font-semibold text-neutral-500">All operations processed.</p>
        {/if}
    </Dialog.Content>
</Dialog.Root>