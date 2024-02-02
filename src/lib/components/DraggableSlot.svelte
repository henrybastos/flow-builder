<script>
    import { createEventDispatcher } from "svelte";
    import { slide } from "svelte/transition";
    import { cn } from "$lib/utils";

    export let slotIndex;
    
    let slotDragOverClassList = ['!border-green-500', '!py-6'];

    const dispatch = createEventDispatcher();

    function hover (node) {
        node.addEventListener('dragover', (evt) => {
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
    class={cn('flex w-full rounded-md py-2 border-neutral-500 border-2 border-dotted transition-all', $$restProps.class)}
></span>