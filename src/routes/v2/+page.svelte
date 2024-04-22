<script>
   import { onMount, setContext } from 'svelte';
   import { writable } from 'svelte/store';
   import { toast } from 'svelte-sonner';
   import { ServerHandler } from '$lib/ServerHandler';
   import { LOGGER, TAGS } from "$lib/LogStore";
   import * as Card from '$lib/components/ui/card';
   import AlertStopExecution from '../compose/AlertStopExecution.svelte';
   import Button from '$lib/components/ui/button/button.svelte';
   import FlowDropdown from './FlowDropdown.svelte';
   import FlowOperation from './FlowOperation.svelte';
   import Ihi from '$lib/components/Ihi.svelte';
   import PayloadLogsPanel from '../compose/PayloadLogsPanel.svelte';
   import PayloadOutputPanel from './PayloadOutputPanel.svelte';
   import {
      Draggy,
      DraggyItem,
      DraggyPlaceholder,
      DraggyVoid
   } from '$lib/components/draggy/index.js';
   import EditPayloadPanel from './EditPayloadPanel.svelte';
   import AddOperationsPanel from './AddOperationsPanel.svelte';
   import AddFlowPanel from './AddFlowPanel.svelte';

   let isLogsPanelOpen = false;
   let isPayloadRunning = false;
   let isOutputPanelOpen = false;
   let isStopExecutionPanelOpen = false;
   let isEditPayloadPanelOpen = false;
   let isAddOperationPanelOpen = false;
   let isAddFlowPanelOpen = false;
   let footerMessage = writable('');
   let footerFixedMessage = writable('');
   let footerLoading = writable(false);
   let responseTextareaEl;
   let activeFlow;
   let draggyRoot;

   let PAYLOAD = {
      "env": {
         "_$fb": {
            "pages": {
               "main_page": "main_page"
            }
         }
      },
      "flows": {
         "main_flow": [
            {
               "command": "goto",
               "enabled": true,
               "target": "https://tabler.io/icons/icon/loader-2"
            },
            {
               "command": "eval_expression",
               "enabled": true,
               "expression": "env({ icon_title: x(`//a[@data-title=\"Copy name\"]`).innerText })"
            }
         ]
      },
      "config": {
         "ws_endpoint": "",
         "close_browser_on_finish": true,
         "close_browser_on_cancel_request": false,
         "headless": false
      }
   };

   ServerHandler.logger = LOGGER;
   ServerHandler.logger_tags = TAGS;

   function setFooterMessage (message, { loading, fixed } = { loading: null, fixed: false }) {
      if (loading != null) {
         $footerLoading = loading;
      }

      if (fixed) {
         $footerFixedMessage = `[${ new Date().toLocaleTimeString() }]: ${ message }`;
         $footerMessage = $footerFixedMessage;
      } else {
         $footerMessage = message;
      }
   }

   async function runCombinedPayload() {
      const sendPayloadPromise = new Promise(async (resolve, reject) => {
         isPayloadRunning = true;
         setFooterMessage('Executing payload...', { loading: true, fixed: true });

         const fetchError = await ServerHandler.sendFlowPayload(PAYLOAD);
         
         if (fetchError) { 
            console.log("ERROR", fetchError);
            isPayloadRunning = false;
            setFooterMessage('Payload failed to execute.', { fixed: true });
            reject(fetchError);
         }
         
         isPayloadRunning = false;
         resolve();
      })

      toast.promise(sendPayloadPromise, {
         loading: 'Executando carga...',
         success: () => {
            isPayloadRunning = false;
            setFooterMessage('Payload executed.', { loading: false, fixed: true });
            return 'Carga executada'
         },
         error: 'Ocorreu um erro. Cheque os logs.'
      });
   }

   setContext('footerMessage', $footerMessage);
   setContext('footerFixedMessage', $footerFixedMessage);
   setContext('footerLoading', $footerLoading);

   function copyResponsePayloadToClipboard () {
      if (navigator.clipboard && window.isSecureContext) {
         window.navigator.clipboard.writeText(JSON.stringify(JSON.parse(ServerHandler.responsePayload), null ,3));
      } else {
         console.warn(`Context is not secure (${ window.isSecureContext }). Using select and copy.`);
         responseTextareaEl.select();
         document.execCommand('copy');
      }
      
      toast.success('Saída copiada para a Área de Transferência!');
   }

   async function stopPayloadRequest () {
      await ServerHandler.closeBrowser();
      // isPayloadRunning = false;
   }

   function openAddOperationPanel ({ detail }) {
      activeFlow = detail.flowID;
      isAddOperationPanelOpen = true;
   }

   function addOperation ({ detail }) {
      draggyRoot.addItem(activeFlow, detail.operation);
   }

   function addFlow ({ detail }) {
      draggyRoot.addList(detail.flowName);
   }

   function deleteFlow ({ detail }) {
      console.log(detail.flowID);
   }

   onMount(() => {
      Array.from(document.querySelectorAll('[data-footer-message]')).forEach(el => {
         el.addEventListener('mouseenter', () => {
            setFooterMessage(el.dataset.footerMessage);
         })

         el.addEventListener('mouseleave', () => {
            setFooterMessage($footerFixedMessage || '');
         })
      })

      document.addEventListener('keypress', (evt) => {
         if (evt.code === 'KeyI' && evt.ctrlKey) {
            const selectedElement = document.activeElement;
            const [ selStart, selEnd ] = [selectedElement.selectionStart, selectedElement.selectionEnd];
            console.log(selStart, selEnd);

            selectedElement.value = [
               selectedElement.value.slice(0, selStart),
               'Ihi',
               selectedElement.value.slice(selEnd)
            ].join('');
         }
      })
   })
</script>

<Ihi />

<svelte:head>
   <title>Flow Builder 2.0</title>
</svelte:head>

<main class="flex flex-col w-screen overflow-hidden items-center">
   <header class="fixed top-2 w-[60rem] h-fit bg-white bg-opacity-5 backdrop-blur-md rounded-lg">
      <div class="p-2">
         {#if isPayloadRunning}
            <Button on:click={() => isStopExecutionPanelOpen = true} data-footer-message='[StopBrowser]: Stops the payload execution.' variant="ghost">
               <i class="ti ti-player-stop text-red-500 mr-2"></i> Stop
            </Button>
         {:else}
            <Button on:click={runCombinedPayload} data-footer-message='[RunMainFlow]: Executes the payload.' variant="ghost">
               <i class="ti ti-player-play-filled mr-2"></i> Run 
            </Button>
         {/if}
         
         <Button variant="ghost" data-footer-message='[Logs]: Opens the Logs panel.' on:click={() => isLogsPanelOpen = true}>
            <i class="ti ti-logs mr-2"></i> Logs
         </Button>

         <Button variant="ghost" data-footer-message='[Output]: Opens the Output panel.' on:click={() => isOutputPanelOpen = true}>
            <i class="ti ti-toilet-paper mr-2"></i> Output
         </Button>
      </div>
   </header>

   {#if PAYLOAD} 
      {#key isEditPayloadPanelOpen}
         <Draggy class="flex flex-row mt-11 p-6 justify-center" let:list bind:list={PAYLOAD.flows} bind:this={draggyRoot}>
            <Card.Root class="w-[60rem] h-min">
               <Card.Header class="flex flex-row justify-between items-center">
                  <Card.Title class="text-3xl">Flow Builder</Card.Title>

                  <div class="space-x-1">
                     <Button on:click={() => isEditPayloadPanelOpen = true} data-footer-message='[EditPayloadPanel]: Edits the payload.' size="icon" variant="ghost">
                        <i class="ti ti-braces"></i>
                     </Button>
   
                     <Button on:click={() => isAddFlowPanelOpen = true} data-footer-message='[AddFlowPanel]: Adds a new flow to the payload.' size="icon" variant="ghost">
                        <i class="ti ti-playlist-add"></i>
                     </Button>
                  </div>
               </Card.Header>

               <Card.Content class="flex flex-col w-full space-y-6 justify-center">
                  {#each list as flow (flow.context_id)}
                     <Card.Root class="w-full h-min">
                        <Card.Header class="flex flex-row justify-between items-center">
                           <Card.Title class="text-2xl capitalize text-blue-500">{ flow.context_id.replaceAll('_', ' ') }</Card.Title>
                           <FlowDropdown 
                              on:addoperation={openAddOperationPanel} 
                              on:deleteflow={deleteFlow}
                              bind:flow={PAYLOAD.flows[flow.context_id]} 
                              bind:flowID={flow.context_id} 
                           />
                        </Card.Header>
                        
                        <Card.Content class="p-0 divide-y divide-neutral-800 border-y border-neutral-800">
                           {#each flow.list as operation (operation.id)}
                              <DraggyItem item={operation}>
                                 <FlowOperation flows={PAYLOAD.flows} {operation} />
                              </DraggyItem>
                           {:else}
                              <DraggyVoid class="text-neutral-600" contextID={flow.context_id}>
                                 <div class="m-4 p-4 border-2 border-neutral-800 border-dashed rounded-lg">
                                    <h6>No operations</h6>
                                 </div>
                              </DraggyVoid>
                           {/each}
                        </Card.Content>
                        
                        <Card.Footer class="p-3">
                           <p class="text-neutral-600 w-full text-center">{ flow.list.length } operations</p>
                        </Card.Footer>
                     </Card.Root>
                  {/each}
               </Card.Content>
            </Card.Root>

            <DraggyPlaceholder offset={{ x: -25 }}>
                  <div class="flex flex-row p-3 w-[30rem] border-2 border-neutral-700 rounded-lg">
                     <i data-draggy-grab class="ti ti-grip-vertical mr-3 cursor-grab"></i>
                     <h6>Operation</h6>
                  </div>
            </DraggyPlaceholder>
         </Draggy>
      {/key}   
   {/if}

   <footer class="inline-flex items-center fixed w-full bottom-0 bg-neutral-900 h-8 p-1">
      {#if $footerLoading}
         <i class="ti ti-loader-2 text-sm text-center w-fit h-fit flex mx-2 animate-spin text-neutral-500"></i>
      {/if}

      <p class="text-sm font-code w-full text-neutral-400">
         { $footerMessage }
      </p>
   </footer>
</main>

<AlertStopExecution bind:isPanelOpen={isStopExecutionPanelOpen} stopAction={stopPayloadRequest} />
<PayloadOutputPanel bind:isPanelOpen={isOutputPanelOpen} bind:isPayloadRunning />
<PayloadLogsPanel {toast} bind:isPanelOpen={isLogsPanelOpen} bind:isPayloadRunning />
<EditPayloadPanel bind:payload={PAYLOAD} bind:isPanelOpen={isEditPayloadPanelOpen} />
<AddOperationsPanel bind:isPanelOpen={isAddOperationPanelOpen} on:newoperation={addOperation} bind:flowID={activeFlow} bind:flow={PAYLOAD.flows}/>
<AddFlowPanel bind:isPanelOpen={isAddFlowPanelOpen} on:addflow={addFlow} />