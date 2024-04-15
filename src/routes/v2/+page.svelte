<script>
   import { toast } from 'svelte-sonner';
   import Draggy from '$lib/components/draggy/Draggy.svelte';
   import DraggyItem from '$lib/components/draggy/DraggyItem.svelte';
   import DraggyPlaceholder from '$lib/components/draggy/DraggyPlaceholder.svelte';
    import DraggyVoid from "$lib/components/draggy/DraggyVoid.svelte";

   let PAYLOAD = {
      "env": {
         "videos": [
            {
               "video_url": "https://www.youtube.com/watch?v=2733cRPudvI"
            },
            {
               "video_url": "https://www.youtube.com/watch?v=boqC9QenshY"
            },
            {
               "video_url": "https://www.youtube.com/watch?v=uQE_4Q-HZZw"
            }
         ]
      },
      "flows": {
         "main_flow": [
            {
               "command": "run_flow_for_each",
               "enabled": true,
               "flow": "scrape_video_info",
               "env_var": "@@videos@"
            }
         ],
         "scrape_video_info": [
            {
               "command": "goto",
               "enabled": true,
               "target": "@@video_url@"
            },
            {
               "command": "eval_expression",
               "enabled": true,
               "expression": "async_eval(5, 1000, () => { console.log('Hello!') })"
            },
            {
               "command": "eval_expression",
               "enabled": true,
               "expression": "(() => { console.log('Hello!') })()"
            }
         ]
      },
      "config": {
         "ws_endpoint": "",
         "close_browser_on_finish": false,
         "close_browser_on_cancel_request": false,
         "headless": false
      }
   };
</script>

<main class="flex flex-col">
   {#if PAYLOAD}    
      <!-- <pre>{ JSON.stringify(allFlows, null, 3) }</pre> -->
      <Draggy class="flex flex-row" let:list bind:list={PAYLOAD.flows}>
         {#each list as flow}
            <div class="flex flex-col">
               <h3 class="uppercase text-lg font-semibold">{ flow.context_id }</h3>
               
               <div class="p-3 border-2 border-neutral-700 rounded-lg space-y-3">
                  {#each flow.list as operation}    
                     <DraggyItem item={operation}>
                           <div class="flex flex-row p-6 border-2 border-neutral-700 rounded-lg">
                              <i data-draggy-grab class="ti ti-menu-2 mr-3 cursor-grab"></i>
                              <h6>{ operation.data.command }</h6>
                           </div>
                     </DraggyItem>
                  {:else}
                     <DraggyVoid contextID={flow.context_id}>
                        <h6 class="m-2">No operations</h6>
                     </DraggyVoid>
                  {/each}
               </div>
            </div>
         {/each}
   
         <DraggyPlaceholder offset={{ x: -25 }}>
               <div class="flex flex-row p-3 w-[30rem] border-2 border-neutral-700 rounded-lg">
                  <i data-draggy-grab class="ti ti-menu-2 mr-3 cursor-grab"></i>
                  <h6>Operation</h6>
               </div>
         </DraggyPlaceholder>
      </Draggy>
   
      <pre class="p-6 w-[40rem]">{ JSON.stringify(PAYLOAD.flows, null, 3) }</pre>
   {/if}
</main>