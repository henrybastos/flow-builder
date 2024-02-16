<script>
    import { createEventDispatcher } from "svelte";
    import Draggable from "$lib/components/Draggable.svelte";
    let isOnDrag = false;
    let dragFromIndex;
    let dragToIndex;
    
    export let isDraggable = true;
    export let itemsList;

    const dispatch = createEventDispatcher();

    function handleDragStart ({ detail }) {
        dragFromIndex = detail.from;
        isOnDrag = isDraggable;
    }

    function handleDragEnd () { isOnDrag = false; }

    function handleDrop ({ detail }) {
        dragToIndex = detail.to;

        let itemToInsert = itemsList[dragFromIndex];
        itemsList[dragFromIndex] = { __draggable_item_to_delete__: itemsList[dragFromIndex] };
        
        if (dragToIndex === (itemsList.length + 1)) {
            itemsList.splice(dragToIndex + 1, 0, itemToInsert);
        } else {
            itemsList.splice(dragToIndex, 0, itemToInsert);
        }

        itemsList.splice(itemsList.indexOf(itemsList.find(item => item.__draggable_item_to_delete__)), 1);
        dispatch('drop', detail);
    }
</script>

<div class={$$restProps.class}>
    {#each itemsList as item, index}
        <Draggable 
            {isOnDrag} 
            on:dragstart={handleDragStart}
            on:dragend={handleDragEnd}
            on:drop={handleDrop}
            activeIndex={dragFromIndex}
            lastIndex={itemsList.length}
            cardIndex={index}
        >
            <slot {item} {index}/>
        </Draggable>
    {/each}
</div>