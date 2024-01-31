<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Sheet from "$lib/components/ui/sheet";
    import Draggable from "$lib/components/Draggable.svelte";
    import { onMount } from "svelte";

    let isSheetOpen = false;
    let moving = false;
    let observed_els = [];
    let cardsList;

    function handleDragStart () {
        moving = true;
        console.log('Dragging');
        // isSheetOpen = false;
    }

    let evalXPath, onChange;

    onMount(() => {
        evalXPath = (xpath) => {
            // Source: https://stackoverflow.com/questions/32467897/searching-the-dom-for-multiples-of-the-same-string-using-xpath
            // by MiMFa
            return Array.from(
                (function*(){ 
                    let iterator = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null); 
                    let current = iterator.iterateNext(); 
                    while(current){ 
                        yield current; 
                        current = iterator.iterateNext(); 
                    }  
                })()
            );
        }

        onChange = (...observed_values) => {
            console.log('AAAA');
            const xpath = '//*/span[@debug-id="card_drag_slot"]';
            const dragSlots = evalXPath(xpath);
            console.log('dragSlots', dragSlots);
        }
    })

    function becomeObservable (node) {
        observed_els.push(node);
        console.log(node);
    }
    
    // $: evalXPath && onChange(isSheetOpen);
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

        <div bind:this={cardsList}>
            {#each [1,2,3] as card}
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <span use:becomeObservable debug-id="card_drag_slot" class={`card_drag_slot flex w-full h-10 rounded-lg border-neutral-600 border-2 hover:border-emerald-400`}></span>
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

                    <Draggable class="w-full h-full" start={{ x:0, y: 0 }} obsRoot={cardsList} bind:observableElements={observed_els} on:dragstart={handleDragStart}>
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