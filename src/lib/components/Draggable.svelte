<script>
    import DraggableSlot from "./DraggableSlot.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let cardIndex;
    export let hoverSlotIndex;
    export let isOnDrag = false;
    export let lastIndex;
    export let activeIndex;

    function draggable (node) {
        // id="card_{cards[index]}:{cards[index + 1]}"
        node.draggable = "true";

        node.addEventListener('drag', () => {
            let dragElement = node.getBoundingClientRect();
            if(dragElement.top < 0){ window.scrollBy(0, -10); }
            if(dragElement.bottom > window.innerHeight){ window.scrollBy(0, 10); }
        })

        node.addEventListener('dragstart', () => {
            isOnDrag = true;
            console.log('DRAG START', cardIndex, hoverSlotIndex);
            dispatch('dragstart', { from: cardIndex });
        })

        node.addEventListener('dragend', () => {
            isOnDrag = false;
            dispatch('dragend');
        })
    }

    $: showFirst = 
        isOnDrag && 
        activeIndex != hoverSlotIndex && 
        activeIndex != (hoverSlotIndex - 1)

    $: showLast = 
        isOnDrag && 
        activeIndex != hoverSlotIndex && 
        (activeIndex != (hoverSlotIndex - 1) || activeIndex == (lastIndex - 2)) && 
        hoverSlotIndex == (lastIndex - 1);
</script>

<div>
    {#if showFirst} <DraggableSlot on:drop slotIndex={hoverSlotIndex} /> {/if}

    <div use:draggable card-index={cardIndex}> <slot /> </div>

    {#if showLast} <DraggableSlot on:drop slotIndex={hoverSlotIndex + 1} /> {/if}
</div>