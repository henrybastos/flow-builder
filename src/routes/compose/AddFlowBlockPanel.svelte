<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import { FlowBlocks } from "$lib/flow-blocks/FlowBlocks";
    import * as Card from "$lib/components/ui/card";
    import Button from "$lib/components/ui/button/button.svelte";

    export let isPanelOpen = false;
    export let flowBlocksList;
    export let openFlowBlockDialog;

    function addBlock (block) {
        flowBlocksList = [
            ...flowBlocksList,
            block
        ]

        console.log(flowBlocksList);

        isPanelOpen = false;
    }
</script>

<Dialog.Root bind:open={isPanelOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title class="text-xl">Adicionar bloco</Dialog.Title>
            <!-- <Dialog.Description>{ flowBlock.description }</Dialog.Description> -->
        </Dialog.Header>

        {#each FlowBlocks as block}
            <Card.Root class="rounded-lg">
                <Card.Header class="p-4">
                    <Card.Title class="text-xl text-left flex justify-between">
                        {block.title}

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
        {/each}
    </Dialog.Content>
</Dialog.Root>
