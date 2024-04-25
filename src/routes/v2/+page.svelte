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
   import { Skeleton } from '$lib/components/ui/skeleton';
   import Navbar from './Navbar.svelte';
   import PayloadPresetsPanel from './PayloadPresetsPanel.svelte';

   let isPayloadRunning = false;
   
   let isStopExecutionPanelOpen = false;
   let isLogsPanelOpen = false;
   let isOutputPanelOpen = false;
   let isEditPayloadPanelOpen = false;
   let isAddFlowPanelOpen = false;
   let isAddOperationPanelOpen = false;
   let isPayloadPresetsPanelOpen = false;

   let footerMessage = writable('');
   let footerFixedMessage = writable('');
   let footerLoading = writable(false);
   let responseTextareaEl;
   let activeFlow;
   let draggyRoot;
   let hasLoadFinished = false;

   const DEFAULT_PAYLOAD = {
      "env": {
         "_$fb": {
            "pages": {
               "main_page": "main_page"
            }
         }
      },
      "flows": {
         "main_flow": []
      },
      "config": {
         "ws_endpoint": "",
         "close_browser_on_finish": false,
         "close_browser_on_cancel_request": false,
         "headless": false
      }
   };
   let PAYLOAD = DEFAULT_PAYLOAD;

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
      draggyRoot.deleteList(detail.flowID);
   }

   function savePayloadToLS () {
      localStorage.setItem('tempPayload', JSON.stringify(PAYLOAD));
      toast.success('Temp payload saved to Local Storage.');
   }

   function loadPayloadFromLS () {
      try {
         const LSPayload = JSON.parse(localStorage.getItem('tempPayload'));
         PAYLOAD = LSPayload;
         draggyRoot.setList(LSPayload.flows);
         console.log('Payload loaded from the Local Storage.');
         toast.info('Payload loaded from the Local Storage.');
      } catch (err) {
         toast.error('Failed to load the payload from the Local Storage.');
         console.log('Failed to load the payload from the Local Storage.');
         loadDefaultPayload();
         console.error(err);
      }
      hasLoadFinished = true;
   }

   function loadDefaultPayload () {
      PAYLOAD = DEFAULT_PAYLOAD;
      draggyRoot.setList(DEFAULT_PAYLOAD.flows);
      console.log('New blank payload loaded');
      toast.info('New blank payload loaded');
   }

   function loadBlankPayload () {
      loadDefaultPayload();
   }

   onMount(() => {
      // console.log('LS PAYLOAD', localStorage.getItem('tempPayload'), PAYLOAD);
      loadPayloadFromLS();

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

<svelte:head>
   <title>Flow Builder 2.0</title>
</svelte:head>

<main class="flex flex-col w-screen overflow-hidden items-center">
   <Navbar 
      bind:isStopExecutionPanelOpen bind:isLogsPanelOpen bind:isOutputPanelOpen bind:isEditPayloadPanelOpen bind:isAddFlowPanelOpen
      {runCombinedPayload} {savePayloadToLS} {loadBlankPayload}
      bind:isPayloadRunning 
   />

   {#if PAYLOAD} 
      <Draggy class="flex flex-row mt-11 p-6 justify-center" let:list bind:list={PAYLOAD.flows} bind:this={draggyRoot}>
         {#key isEditPayloadPanelOpen}
            <Card.Root class="w-[60rem] h-min">
               <Card.Header class="flex flex-row justify-between items-center">
                  <Card.Title class="text-3xl">Flow Builder</Card.Title>
               </Card.Header>

               <Card.Content class="flex flex-col w-full space-y-6 justify-center">
                  <p>{ new Date().toLocaleTimeString() }</p>
                  {#each list as flow (flow.context_id)}
                     <Card.Root class="w-full h-min">
                        <Card.Header class="flex flex-row justify-between items-center border-b-2 border-b-blue-500">
                           <Card.Title class="text-2xl capitalize text-blue-500">{ flow.context_id.replaceAll('_', ' ') }</Card.Title>
                           <FlowDropdown 
                              on:addoperation={openAddOperationPanel} 
                              on:deleteflow={deleteFlow}
                              bind:flow={PAYLOAD.flows[flow.context_id]} 
                              bind:flowID={flow.context_id} 
                           />
                        </Card.Header>
                        
                        <Card.Content class="p-0 divide-y divide-neutral-800 border-y border-neutral-800">
                           {#if hasLoadFinished}
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
                           {:else}
                              <Skeleton class="h-[15rem] m-6 rounded-xl" />
                           {/if}
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
         {/key}   
      </Draggy>
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
<PayloadOutputPanel {toast} bind:isPanelOpen={isOutputPanelOpen} bind:isPayloadRunning />
<PayloadLogsPanel {toast} bind:isPanelOpen={isLogsPanelOpen} bind:isPayloadRunning />
<Ihi />
<EditPayloadPanel bind:payload={PAYLOAD} bind:isPanelOpen={isEditPayloadPanelOpen} />
<AddOperationsPanel bind:isPanelOpen={isAddOperationPanelOpen} on:newoperation={addOperation} bind:flowID={activeFlow} bind:flow={PAYLOAD.flows}/>
<AddFlowPanel bind:isPanelOpen={isAddFlowPanelOpen} on:addflow={addFlow} />
<!-- <PayloadPresetsPanel bind:isPanelOpen={isPayloadPresetsPanelOpen} /> -->