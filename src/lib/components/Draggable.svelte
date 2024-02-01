<script>
    import DraggableSlot from "./DraggableSlot.svelte";
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let cardIndex;
    export let hoverSlotIndex;
    export let isOnDrag = false;
    export let lastIndex;
    export let activeIndex;

    let lastDraggedOver;
    let draggableDragOverClassList = [
        'outline-neutral-500',
        'outline-offset-2',
        'outline-double',
        'outline-2'
    ];

    function draggable (node) {
        // id="card_{cards[index]}:{cards[index + 1]}"
        node.draggable = "true";
        draggableDragOverClassList.push(
            `rounded-[${ getComputedStyle(node.firstChild)['border-radius'] }]`
        )

        node.addEventListener('drag', () => {
            let dragElement = node.getBoundingClientRect();
            if(dragElement.top < 0){ window.scrollBy(0, -10); }
            if(dragElement.bottom > window.innerHeight){ window.scrollBy(0, 10); }
        })

        node.addEventListener('dragstart', (evt) => {
            if (evt.target === node) {
                dispatch('dragstart', { 
                    from: cardIndex,
                    target: node
                });
                isOnDrag = true;
                draggableDragOverClassList.forEach(className => node.classList.add(className));
            }
        })
        
        node.addEventListener('dragend', () => {
            dispatch('dragend');
            isOnDrag = false;
            draggableDragOverClassList.forEach(className => node.classList.remove(className));
        })

        node.addEventListener('dragover', (evt) => {
            if (evt.target !== lastDraggedOver) {
                lastDraggedOver = evt.target;
                // console.log(evt.target.getAttribute('draggable_id'));
            }
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
    {#if showFirst} <DraggableSlot on:dragend on:drop slotIndex={hoverSlotIndex} /> {/if}

    <div use:draggable card-index={cardIndex}> <slot /> </div>

    {#if showLast} <DraggableSlot on:drop slotIndex={hoverSlotIndex + 1} /> {/if}
</div>