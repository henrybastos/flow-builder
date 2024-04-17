<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Card from "$lib/components/ui/card";
    // import { FlowBlocks } from "$lib/flow-blocks/FlowBlocks";
    import Button from "$lib/components/ui/button/button.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import ScrollArea from "$lib/components/ui/scroll-area/scroll-area.svelte";

    let highlightedBlockID = '';

    export let flowBlocks;
    export let DEV_MODE;
    export let isPanelOpen = false;
    export let flowBlocksList;
    // export let openFlowBlockDialog;
    export let combinedEnvPayload;

    const tags_color = {
        kiwify: 'bg-emerald-500',
        eduzz: 'bg-amber-500',
        dev: 'bg-purple-500',
        youtube: 'bg-red-500',
        kronus: 'bg-orange-500',
        google: 'bg-blue-500',
        tool: 'bg-cyan-500'
    }

    function addBlock (block) {
        let hasEnvPayload = Object.keys(block.env_payload).length > 0;

        flowBlocksList = [
            ...flowBlocksList,
            block
        ]

        // Verifies if there are inputs to be filled with their respective default value
        if (hasEnvPayload && combinedEnvPayload) {
            combinedEnvPayload = {
               ...combinedEnvPayload,
               ...block.env_payload,
            };

            for (let [env_field, env_value] of Object.entries(block.payload.env)) {
                // Ignores private env vars that starts with a _
                // e.g.: _admin_password
                if (!env_field.match(/^_.*/g)) {
                    console.log('Loading default values\n Key: ', combinedEnvPayload[env_field], '\nValue: ', env_value);
                    combinedEnvPayload[env_field].value = env_value;
                }
            }
            console.log(combinedEnvPayload);
        }

        isPanelOpen = false;
    }

    function highlightBlock (block_id) {
        highlightedBlockID = block_id;
        document.getElementById(highlightedBlockID).scrollIntoView();

        setTimeout(() => {
            highlightedBlockID = '';
        }, 4000)
    }
</script>

<Dialog.Root bind:open={isPanelOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title class="text-xl">Adicionar bloco</Dialog.Title>
            <!-- <Dialog.Description>{ flowBlock.description }</Dialog.Description> -->
        </Dialog.Header>

        <ScrollArea class="h-[36rem] rounded-lg border border-neutral-800">
            <div class="space-y-4 p-2">
                {#if flowBlocks}
                    {#each flowBlocks as block}
                        {#if DEV_MODE === block?.tags?.includes('dev') || !block?.tags?.includes('dev')}    
                            <Card.Root id="{block.block_id}" class="rounded-lg transition-all { block.block_id === highlightedBlockID ? 'border-amber-500' : '' }">
                                <Card.Header class="flex flex-row p-4 text-xl text-left justify-between items-center">
                                    <Card.Title>
                                        <div class="space-x-2">
                                            <h3 class="inline-flex">{block.title}</h3>
    
                                            {#if block.tags}
                                                {#each block.tags as tag}
                                                    <Badge class="{ tags_color[tag] } uppercase font-bold">{ tag }</Badge>
                                                {/each}
                                            {/if}
                                        </div>
                                    </Card.Title>
    
                                    <Button on:click={() => addBlock(block)} size="icon">
                                        <i class="ti ti-plus"></i>
                                    </Button>
                                </Card.Header>
    
                                <Card.Content class="p-4 pt-0 divide-y">
                                    <p class="text-muted-foreground pb-2">{block.description}</p>
    
                                    {#if block?.dependencies}    
                                        <div class="pt-2 space-x-2">
                                            <span class="text-sm">DEPENDÊNCIAS:</span>
                                            
                                            {#each block?.dependencies || [] as dep_block_id}
                                                <span class="cursor-pointer" on:click={() => highlightBlock(dep_block_id)}>
                                                    <Badge variant="secondary" class="uppercase font-bold text-neutral-300">{ flowBlocks.find(_block => _block.block_id === dep_block_id).title }</Badge>
                                                </span>
                                            {/each}
                                        </div>
                                    {/if}
                                </Card.Content>
                            </Card.Root>
                        {/if}
                    {:else}
                        <p class="text-muted-foreground w-full text-center">
                            Nenhum bloco à ser carregado
                            <i class="ti ti-spider"></i>
                        </p>
                    {/each}
                {:else}
                    <p class="text-red-600 w-full text-center">
                        <i class="ti ti-error-404 mr-1"></i>
                        Arquivo FlowBlocks.ts não encontrado.
                    </p>
                {/if}
            </div>
        </ScrollArea>
    </Dialog.Content>
</Dialog.Root>
