<script>
    import Draggable from "$lib/components/Draggable.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
    import { slide } from "svelte/transition";
    let observableElements = [];
    let targetEl;
    let marginTop = 0;
    $: isOnDrag = false;
    let activeIndex = -1;
    let ownerIndex = -1;

    let cards = ['A', 'B', 'C', 'D'];

    function subscribe (node) {
        observableElements.push(node);
    }

    
    function subscribeALl () {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => console.log(entry));
        }, {
            root: targetEl,
            threshold: 0.1
        });

        observableElements.forEach(el => {
            observer.observe(el);
            console.log('TARGET SUBSCRIBED');
        });

        console.log('SUBS', observableElements);
    }

    // function subscribeALl () {
    //     console.log('SUBS', observableElements);
    //     observableElements.forEach(el => {
    //         const observer = new IntersectionObserver((entries) => {
    //             entries.forEach(entry => console.log(entry));
    //         }, {
    //             root: el,
    //             threshold: 0.1
    //         });
    
    //         observer.observe(targetEl);
    //         console.log('TARGET SUBSCRIBED');
    //     });
    // }

    function handleMouseMove (e) {
        marginTop += e.movementY;
    }

    // function hover (node) {
    //     const dragOverClass = ['!border-green-500'];
    //     const bakCards = cards;

    //     node.addEventListener('dragstart', () => {
    //         ownerIndex = parseInt(node.getAttribute('id').match(/(?<=CARD_).*/gi)[0]);
    //     })

    //     node.addEventListener('dragover', () => {
    //         dragOverClass.forEach(className => node.classList.add(className));
    //         activeIndex = parseInt(node.getAttribute('id').match(/(?<=CARD_).*/gi)[0]);

    //         // cards = [...cards.slice(0, activeIndex + 1), cards[activeIndex], ...cards.slice(activeIndex)];
    //         // cards.splice(activeIndex, 1);
    //     });

    //     node.addEventListener('dragleave', () => {
    //         dragOverClass.forEach(className => node.classList.remove(className));
    //         activeIndex = -1;
    //         // cards = bakCards;
    //     })

    //     node.addEventListener('drop', () => {
    //         console.log('Dropped')
    //         cards.splice(activeIndex, 1, cards[ownerIndex]);
    //         cards = [...cards.slice(0, activeIndex), cards[activeIndex], ...cards.slice(activeIndex + 1)];
    //         // cards.splice(activeIndex, 1);

    //         dragOverClass.forEach(className => node.classList.remove(className));
    //     })
    // }

    function hover (node) {
        // const dragStartClass = ['!bg-green-500', '!py-6'];
        const dragOverClass = ['!bg-green-500', '!py-6'];
        let newArray = [...cards];

        node.addEventListener('dragstart', () => {
            ownerIndex = parseInt(node.getAttribute('id').match(/(?<=CARD_).*/gi)[0]);
        })

        node.addEventListener('dragover', () => {
            dragOverClass.forEach(className => node.classList.add(className));
        });

        node.addEventListener('dragleave', () => {
            dragOverClass.forEach(className => node.classList.remove(className));
        })

        node.addEventListener('drop', () => {
            dragOverClass.forEach(className => node.classList.remove(className));

            const [before, after] = node.getAttribute('id').match(/(?<=CARD_).*/gi)[0].split(':');
            const beforeIndex = cards.indexOf(before);
            const afterIndex = cards.indexOf(after);

            console.log('BEFORE', beforeIndex, before, cards.slice(0, beforeIndex + 1));
            console.log('AFTER', afterIndex, after, cards.slice(afterIndex));
            newArray.splice(ownerIndex, 1);
            console.log('NEW', [
                ...newArray.slice(0, beforeIndex + 1),
                cards[ownerIndex],
                ...newArray.slice(afterIndex)
            ]);
        })
    }

    function draggable (node) {
        node.draggable = "true";

        node.addEventListener('dragstart', () => {
            ownerIndex = node.getAttribute('id').match(/(?<=CARD_).*/gi)[0];
            isOnDrag = true;
        })

        node.addEventListener('dragend', () => {
            isOnDrag = false;
        })
    }

    // [...arr.slice(0, beforeIndex + 1), 'A', ...arr.slice(afterIndex)]
    // .splice(arr.indexOf('A'), 1)
</script>

<!-- <svelte:window on:mo   usemove={handleMouseMove} /> -->

<!-- <div style="margin-top: {marginTop}px;"  class="relative p-10 bg-red-500 rounded-lg">
    <Draggable class="w-24 h-24">
        <div on:dragover={() => console.log('Hey!')} bind:this={targetEl} class="p-10 bg-purple-500 rounded-lg"></div>
    </Draggable>
</div> -->

<!-- <div  class="flex p-10 bg-blue-500 rounded-lg">{ activeIndex }</div> -->

<div class="flex flex-col">
    <h1>{ownerIndex} : { activeIndex } // { isOnDrag }</h1>

    <!-- {#each cards as card, index}
        <div 
            id="CARD_{index}" 
            ondragover="return false" 
            draggable="true" 
            class="px-16 py-4 border-neutral-600 border-2 border-dotted rounded-lg"
        >{ card }</div>
        <span use:hover id="card_{cards[index]}:{cards[index + 1]}" class="flex w-full bg-neutral-800 py-2 rounded transition-all"></span>
    {/each} -->

    {#each cards as card, index}
        <div use:draggable id="CARD_{index}" class="px-16 py-4 border-neutral-600 border-2 border-dotted rounded-lg mb-4 last:mb-0">{ card }</div>
        {#if isOnDrag && index != ownerIndex && index != (ownerIndex - 1)}
            <span 
                transition:slide
                ondragover="return false" 
                use:hover 
                id="card_{cards[index]}:{cards[index + 1]}" 
                class="flex w-full bg-neutral-800 py-2 rounded transition-all mb-4"
            ></span>
        {/if}
    {/each}

    <Button on:click={subscribeALl}>Subscribe all</Button>
</div>


<style>
    .hovering {
        @apply border-emerald-400;
    }
</style>