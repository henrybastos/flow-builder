<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";

    export let slotIndex;
    
    let slotDragOverClassList = ['!border-green-500', '!py-6'];

    const dispatch = createEventDispatcher();

    function hover (node) {
        node.addEventListener('dragover', () => {
            slotDragOverClassList.forEach(className => node.classList.add(className));
        });

        node.addEventListener('dragleave', () => {
            slotDragOverClassList.forEach(className => node.classList.remove(className));
        })

        node.addEventListener('drop', (evt) => {
            slotDragOverClassList.forEach(className => node.classList.remove(className));
            const toIndex = evt.target.getAttribute('target-id');
            dispatch('drop', { to: parseInt(toIndex) });
        })
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span 
    use:hover
    transition:slide={{ duration: 200 }}
    ondragover="return false" 
    target-id={slotIndex}
    class="flex w-full py-2 rounded transition-all border-neutral-500 border-2 border-dotted"
></span>