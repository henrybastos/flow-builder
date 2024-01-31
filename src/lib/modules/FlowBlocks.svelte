<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Sheet from "$lib/components/ui/sheet";
    import { onMount } from "svelte";
    import DraggableList from "$lib/components/DraggableList.svelte";

    let isSheetOpen = false;
    let cardsList = [
        {
            title: 'Card 001',
            description: 'Card 001 description'
        },
        {
            title: 'Card 002',
            description: 'Card 002 description'
        },
        {
            title: 'Card 003',
            description: 'Card 003 description'
        }
    ];
</script>

<svelte:window on:load={() => console.log('Hello!')}/>

<Sheet.Root bind:open={isSheetOpen}>
    <Sheet.Trigger>
        <Button debug-id="open-flow-blocks-button" variant="secondary">Flow Blocks</Button>
    </Sheet.Trigger>

    <Sheet.Content>
        <Sheet.Header class="mb-4">
            <Sheet.Title>Add Flow Block</Sheet.Title>
        </Sheet.Header>

        <DraggableList bind:itemsList={cardsList} let:item class="flex flex-col gap-y-3">
            <Card.Root class="rounded-lg">
                <Card.Header class="p-4 pb-0">
                    <Card.Title class="text-xl text-left">{ item.title }</Card.Title>
                    <Card.Description class="text-base">{ item.description }</Card.Description>
                </Card.Header>
                <Card.Content class="p-4">
                <Button class="w-full" variant="outline">See code</Button>
                </Card.Content>
            </Card.Root>
        </DraggableList>
    </Sheet.Content>
</Sheet.Root>