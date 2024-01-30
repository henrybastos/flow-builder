<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Sheet from "$lib/components/ui/sheet";
    import Draggable from "$lib/components/Draggable.svelte";

    let isSheetOpen = false;
    let moving = false;

    function handleDragStart () {
        moving = true;
        console.log('Dragging');
        // isSheetOpen = false;
    }
</script>

<Sheet.Root bind:open={isSheetOpen}>
    <Sheet.Trigger>
        <Button debug-id="open-flow-blocks-button" variant="secondary">Flow Blocks</Button>
    </Sheet.Trigger>

    <Sheet.Content>
        <Sheet.Header class="mb-4">
            <Sheet.Title>Add Flow Block</Sheet.Title>
        </Sheet.Header>

        <div>
            {#each [1,2,3] as card}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span class={`flex w-full h-10 rounded-lg border-neutral-600 border-2 hover:border-emerald-400`}></span>
                <div class="relative select-none">
                    <Card.Root class="rounded-lg">
                        <Card.Header class="p-4 pb-0">
                            <Card.Title class="text-xl text-left">Eduzz Login</Card.Title>
                            <Card.Description class="text-base">Login into Eduzz</Card.Description>
                        </Card.Header>
                        <Card.Content class="p-4">
                        <Button class="w-full" variant="outline">See code</Button>
                        </Card.Content>
                    </Card.Root>

                    <Draggable class="w-full h-full" start={{ x:0, y: 0 }} on:dragstart={handleDragStart}>
                        <div class="border-dotted border-2 border-neutral-500 rounded-lg">
                            <Card.Root class="rounded-lg opacity-50">
                                <Card.Header class="p-4 pb-0">
                                    <Card.Title class="text-xl text-left">Eduzz Login</Card.Title>
                                    <Card.Description class="text-base">Login into Eduzz</Card.Description>
                                </Card.Header>
                                <Card.Content class="p-4">
                                <Button class="w-full" variant="outline">See code</Button>
                                </Card.Content>
                            </Card.Root>
                        </div>
                    </Draggable>
                </div>
            {/each}
        </div>
    </Sheet.Content>
</Sheet.Root>