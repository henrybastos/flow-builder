<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    let draggableWrapperEl;

    export let moving = false;
	export let left = 0;
	export let top = 0;
    export let start = {
        x: 100,
        y: 100
    }

	const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => console.log(entry));
    }, {
        root: draggableWrapperEl,
        threshold: 1.0
    })
	
	function onMouseDown() {
        dispatch('dragstart');
		moving = true;
	}
	
	function onMouseMove(e) {
        if (moving) {
            // left += e.movementX;
			top += e.movementY;
		}
	}
	
	function onMouseUp() {
        dispatch('dragend');
        moving = false;
		left = start.x;
		top = start.y;
	}
</script>

<div 
    bind:this={draggableWrapperEl}
    on:mousedown={onMouseDown}
    style="left: {left}px; top: {top}px;" 
    class={`absolute cursor-move ${ moving ? 'opacity-100' : 'opacity-0' } ${ $$restProps.class }`}
>
	<slot { moving } />
</div>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />