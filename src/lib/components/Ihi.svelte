<script>
   import { onMount } from 'svelte';
   let showMichael = null;

   onMount(() => {
      document.addEventListener('keypress', (evt) => {
         if (evt.key === 'i') {
            showMichael = Math.round(Math.random() * 4);
            console.log('Ihi')

            setTimeout(() => {
               showMichael = null;
            }, 24);
         }
      })
   })
</script>

{#if showMichael !== null}
   {#if showMichael === 1}
      <img alt="michale"  class="fixed h-[100vh] w-[100vw]" src="https://media.tenor.com/BU2modgehEgAAAAM/mug-shot-michael-jackson.gif">
   {:else if showMichael === 2}
      <img alt="michale"  class="fixed h-[100vh] w-[100vw]" src="https://imgb.ifunny.co/images/93e2e40cc516c98308cf66fad08d36ff80179d577d26c0ea51ddce781c9d0910_1.jpg">
   {:else if showMichael === 3}
      <img alt="michale" class="fixed h-[100vh] w-[100vw]" src="https://media.tenor.com/bocqs5LYGegAAAAM/jackson-michael-jackson.gif">
   {:else if showMichael === 4}
      <img alt="michale" class="fixed h-[100vh] w-[100vw]" src="https://images3.memedroid.com/images/UPLOADED697/6489aa21a6e4b.jpeg">
   {/if}
{/if}