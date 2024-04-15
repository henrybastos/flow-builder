<script>
   import { onMount, getContext } from "svelte";

   export let offset = {x: 0, y: 0};

   let placeholder;
   let isDragging = getContext('isDragging');

   onMount(() => {
      
      document.addEventListener('mousemove', (event) => {
         if ($isDragging) {
            // Auto center cursor attempt
            // const grabElementRect = placeholder.querySelector('[data-draggy-grab]').getBoundingClientRect();
            // const placeholderRect = placeholder.getBoundingClientRect();
            // const xOffset = grabElementRect.left + placeholderRect.left + (grabElementRect.width / 2);

            const elementHeight = parseInt(getComputedStyle(placeholder).height.match(/\d+/g)[0]);

            placeholder.style.top = `${event.pageY - (elementHeight / 2) + (offset.y || 0)}px`;
            placeholder.style.left = `${event.pageX + (offset.x || 0)}px`;
         }
      })
   })
</script>

{#if $isDragging}
   <div data-draggy-member="draggy_placeholder" bind:this={placeholder} class="absolute pointer-events-none">
      <!-- {@html placeholderClone} -->
      <!-- <div class="rounded-lg p-6 w-[10rem] border border-dashed border-neutral-500 bg-black bg-opacity-50"></div> -->
      <slot />
   </div>
{/if}