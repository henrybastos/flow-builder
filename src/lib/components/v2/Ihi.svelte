<script>
   import { onMount } from 'svelte';
   let showMichael = null;
   let playMichael = 1;
   let wowSfx, heeSfx;
   const enableAudio = true;
   const enableImage = true;
   const volume = 0.2;

   onMount(() => {
      document.addEventListener('keypress', (evt) => {
         if (evt.key === 'i') {
            if (enableAudio) {
               playMichael = Math.ceil(Math.random() * 2);

               try {
                  if (playMichael === 1) {
                     wowSfx.volume = volume;
                     if (wowSfx.currentTime) {
                        wowSfx.currentTime = 0.2;
                     }
                     wowSfx.play();
                  } else if (playMichael === 2) {
                     if (heeSfx.currentTime) {
                        heeSfx.currentTime = 1;
                     }
                     heeSfx.volume = volume;
                     heeSfx.play();
                  }
               } catch (err) {}
   
               setTimeout(() => {
                  try {
                     wowSfx.pause();
                     heeSfx.pause();
                  } catch (err) {}
               }, 200);
            }

            if (enableImage) {
               showMichael = Math.round(Math.random() * 4);
               
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
      <img alt="michale"  class="fixed h-[100vh] w-[100vw]" src="mj-1.gif">
   {:else if showMichael === 2}
      <img alt="michale"  class="fixed h-[100vh] w-[100vw]" src="mj-2.jpg">
   {:else if showMichael === 3}
      <img alt="michale" class="fixed h-[100vh] w-[100vw]" src="mj-3.gif">
   {:else if showMichael === 4}
      <img alt="michale" class="fixed h-[100vh] w-[100vw]" src="mj-4.jpeg">
   {/if}
{/if}