<script>
    import DraggableList from "$lib/components/DraggableList.svelte";

    let cards = ['A', 'B', 'C', 'D', 'E'];    
</script>

<div class="grid place-items-center h-full w-full">
    <div class="flex flex-col border-2 border-neutral-700 p-2 rounded-lg gap-y-2">
        <DraggableList bind:itemsList={cards} let:item>
            <div class="px-16 py-4 border-2 border-neutral-700 select-none rounded-lg">
                { item }
            </div>
        </DraggableList>  
    </div>
</div>