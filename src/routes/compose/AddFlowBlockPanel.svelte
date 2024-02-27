<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Card from "$lib/components/ui/card";
    import { FlowBlocks } from "$lib/flow-blocks/FlowBlocks";
    import Button from "$lib/components/ui/button/button.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";

    export let DEV_MODE;
    export let isPanelOpen = false;
    export let flowBlocksList;
    // export let openFlowBlockDialog;
    export let combinedEnvPayload;

    const tags_color = {
        kiwify: 'bg-emerald-500',
        eduzz: 'bg-amber-500',
        dev: 'bg-purple-500',
        youtube: 'bg-red-500'
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
</script>

<Dialog.Root bind:open={isPanelOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title class="text-xl">Adicionar bloco</Dialog.Title>
            <!-- <Dialog.Description>{ flowBlock.description }</Dialog.Description> -->
        </Dialog.Header>

        <div class="max-h-[36rem] space-y-4 overflow-y-auto">
            {#each FlowBlocks as block}
                {#if DEV_MODE === block?.tags?.includes('dev') || !block?.tags?.includes('dev')}    
                    <Card.Root class="rounded-lg">
                        <Card.Header class="p-4">
                            <Card.Title class="text-xl text-left flex justify-between">
                                <div class="space-x-2">
                                    <h3 class="inline-flex">{block.title}</h3>

                                    {#if block.tags}
                                        {#each block.tags as tag}
                                            <Badge class="{ tags_color[tag] } uppercase font-bold">{ tag }</Badge>
                                        {/each}
                                    {/if}
                                </div>

                                <div class="space-x-2">
            
                                    <Button on:click={() => addBlock(block)} size="icon">
                                        <i class="ti ti-plus"></i>
                                    </Button>
                                </div>
                            </Card.Title>
                            <Card.Description class="text-base">
                                {block.description}
                            </Card.Description>
                        </Card.Header>
                    </Card.Root>
                {/if}
            {/each}
        </div>
    </Dialog.Content>
</Dialog.Root>
