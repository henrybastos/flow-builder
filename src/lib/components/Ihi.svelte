<script>
   import { onMount } from 'svelte';
   let showMichael = null;
   let playMichael = 1;
   let wowSfx, heeSfx;
   const enableAudio = true;
   const enableImage = false;

   onMount(() => {
      document.addEventListener('keypress', (evt) => {
         if (evt.key === 'i') {
            if (enableAudio) {
               playMichael = Math.ceil(Math.random() * 2);
               if (playMichael === 1) {
                  wowSfx.volume = 0.1;
                  if (wowSfx.currentTime) {
                     wowSfx.currentTime = 0.2;
                  }
                  wowSfx.play();
               } else if (playMichael === 2) {
                  if (heeSfx.currentTime) {
                     heeSfx.currentTime = 1;
                  }
                  heeSfx.volume = 0.1;
                  heeSfx.play();
               }
   
               setTimeout(() => {
                  wowSfx.pause();
                  heeSfx.pause();
               }, 200);
            }

            if (enableImage) {
               showMichael = Math.round(Math.random() * 4);
               console.log('Ihi');
               
               setTimeout(() => {
                  showMichael = null;
               }, 20);
            }
         }
      })
   })
</script>

<audio bind:this={wowSfx} id="myAudio">
   <source src="wow.mp3" type="audio/mp3">
   Your browser does not support the audio element.
</audio>

<audio bind:this={heeSfx} id="myAudio">
   <source src="hee-hee.mp3" type="audio/mp3">
   Your browser does not support the audio element.
</audio>

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