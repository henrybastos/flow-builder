<script>
   import { VERSION } from "$lib/store.js";
   import { LOGGER, TAGS } from "$lib/LogStore";
   import { onMount } from "svelte";
   import * as Card from "$lib/components/ui/card";
   import Button from "$lib/components/ui/button/button.svelte";
   import DraggableList from "$lib/components/DraggableList.svelte";
   import EnvPanel from "$lib/components/compose/EnvPanel.svelte";
   import { initStruct } from "$lib/PayloadStore";
   import { ServerHandler } from "$lib/ServerHandler";
   import { toast } from "svelte-sonner";
   import { page } from "$app/stores";
   import FlowBlockPayloadViewerPanel from "$lib/components/compose/FlowBlockPayloadViewerPanel.svelte";
   import AddFlowBlockPanel from "$lib/components/compose/AddFlowBlockPanel.svelte";
   import PayloadLogsPanel from "$lib/components/compose/PayloadLogsPanel.svelte";
   import DevSettingsPanel from "$lib/components/compose/DevSettingsPanel.svelte";
   import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
   import ComposeFlowbar from "$lib/components/compose/ComposeFlowbar.svelte";
   import { env } from "$env/dynamic/public"
   import { setContext } from "svelte";
   import UserSettingsPanel from "$lib/components/compose/UserSettingsPanel.svelte";
   import DevModeAccess from "$lib/components/compose/DevModeAccess.svelte";
    import AlertStopExecution from "$lib/components/compose/AlertStopExecution.svelte";

   export let data;

   let isFlowBlockPanelOpen = false;
   let isEnvPanelOpen = false;
   let isAddFlowBlockOpen = false;
   let isLogsPanelOpen = false;
   let isStopExecutionPanelOpen = false;
   let isDevSettingsPanelOpen = false;
   let isUserSettingsPanelOpen = false;
   let isDevAccessPanelOpen = false;
   let isPayloadRunning = false;
   let isPageLoading = true;

   let devSettings;
   let userSettings;

   let currentFlowBlock = {
      title: "",
      block_id: "",
      description: "",
      payload: {},
   };

   let flowBlocksList = [];
   let combinedPayload = {};
   let combinedEnvPayload = {};

   const DEV_MODE = $page.url.searchParams.has("dev_mode");
   const USE_DEFAULT_ENV_TEST_PAYLOAD = false;
   const DEFAULT_ENV_TEST_PAYLOAD = {
      course_home: "https://my.nutror.com/cursos/448082/editar/modulos",
      modules: [
         {
            module_title: "M TEST 1",
            module_lessons: [
               {
                  lesson_title: "A TEST 1",
                  lesson_link: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
               },
            ],
         },
      ],
      login_email: "dev@kebook.com.br",
      login_password: 'yC3-42aXWSt(C"NH',
   };

   ServerHandler.logger = LOGGER;
   ServerHandler.logger_tags = TAGS;

   setContext('toast', toast);

   function combineAllPayloads() {
      let fullPayload = {};

      function _combineEnv() {
         for (let block of flowBlocksList) {
            fullPayload.env = {
               ...fullPayload.env,
               ...block.payload.env,
            };
         }
      }

      function _combineFlows() {
         fullPayload.flows = {};

         for (let block of flowBlocksList) {
            for (let [flow_name, flow_ops] of Object.entries(block.payload.flows)) {
               fullPayload.flows = {
                  ...fullPayload.flows,
                  [flow_name]: flow_ops,
               };
            }
         }

         fullPayload.flows.main_flow = [];

         for (let block of flowBlocksList) {
            fullPayload.flows.main_flow = [
               ...fullPayload.flows.main_flow,
               ...block.payload.flows.main_flow,
            ];
         }
      }

      _combineEnv();
      _combineFlows();
      fullPayload.config = initStruct.config;
      fullPayload.config.headless = true;
      return structuredClone(fullPayload);
   }

   function openFlowBlockDialog(item) {
      currentFlowBlock = item;
      isFlowBlockPanelOpen = true;
   }

   function updateEnvPayload () {
      if (combinedEnvPayload) {
         for (let [field_name, field_value] of Object.entries(combinedEnvPayload)) {
            combinedPayload.env[field_name] = field_value.value;
         }
      }
   }

   function openCombinedBlocksDialog() {
      let combinedPayloadCard = {
         title: "Carga final",
         description:
            "Todos os blocos combinados. Serão executados sequencialmente.",
      };

      combinedPayload = combineAllPayloads();
      combinedPayloadCard.payload = combinedPayload;

      updateEnvPayload();

      openFlowBlockDialog(combinedPayloadCard);
   }

   function openEnvPanel() {
      isEnvPanelOpen = true;
   }

   async function runCombinedPayload() {
      combinedPayload = combineAllPayloads();

      if (USE_DEFAULT_ENV_TEST_PAYLOAD) {
         combinedPayload.env = DEFAULT_ENV_TEST_PAYLOAD;
         toast.warning("Using DEFAULT_ENV_TEST_PAYLOAD as Env Payload");
      }

      combinedPayload.config.close_browser_on_finish = true;

      if (DEV_MODE) {
         for (let [opt, value] of Object.entries(devSettings)) {
            console.warn(`[DEV MODE] Setting config: ${ opt } as ${ value }`);
            combinedPayload.config[opt] = value;
         }
      }

      const sendPayloadPromise = new Promise(async (resolve, reject) => {
         updateEnvPayload();
         const fetchError = await ServerHandler.sendFlowPayload(combinedPayload);
         
         if (fetchError) { 
            console.log("ERROR", fetchError);
            isPayloadRunning = false;
            reject(fetchError);
         }

         isPayloadRunning = false;
         resolve();
      })

      isPayloadRunning = true;

      toast.promise(sendPayloadPromise, {
         loading: 'Executando carga...',
         success: 'Carga executada',
         error: 'Ocorreu um erro. Cheque os logs.'
      });
   }

   function removeFlowBlock (index) {
      flowBlocksList = flowBlocksList.filter((_,i) => i != index)
      let newCombinedEnvPayload = {}
      
      // Filters what's left in the flowBlocksList, preserving inputed values
      for (let block of flowBlocksList) {
         for (let [env, props] of Object.entries(block.env_payload)) {
            newCombinedEnvPayload[env] = combinedEnvPayload[env]
         }
      }

      combinedEnvPayload = newCombinedEnvPayload;
   }

   async function gitUpdate (scope) {
      console.log('Updating...');
      const response = await fetch('/api/git-update');
      const result = await response.json();
      
      if (result?.status === 500) {
         toast.error('ERRO - Falha na atualização');
      } else if (result?.status === 200) {
         toast.success('Projeto atualizado');
      }

      console.log(result);
   }

   onMount(() => {
      isPageLoading = false;
      
      if (data?.missingFlowBlocksFile) {
         toast.error('Missing FlowBlocks.ts file at /src/lib/flow-blocks');
      }
   });
</script>

<svelte:head>
   <title>Flow Composer</title>
</svelte:head>

<main class="flex flex-col items-center mt-3 relative">
   <span class="flex text-neutral-500 font-semibold">Flow Composer • {VERSION}</span>

   <Card.Root class="flex flex-col p-3 border border-neutral-800 bg-transparent rounded-lg w-[40rem] mt-3 shadow-lg shadow-black">
      <Card.Header class="p-1 mb-3 ">
         <Card.Title class="text-2xl text-left flex justify-between">
            {#if isPageLoading}
               <div class="flex flex-row w-full justify-between">
                  <Skeleton class="w-[20rem] rounded h-[2rem]" />
                  <Skeleton class="w-[2rem] rounded h-[2rem]" />
               </div>
            {:else}
               Carga combinada

               <div class="flex space-x-2">
                  <Button class="text-base" on:click={() => (isLogsPanelOpen = true)} variant="outline">
                     Logs
                  </Button>

                  <!-- <Button on:click={gitUpdate} variant="outline" size="icon">
                     <i class="ti ti-download text-green-500"></i>
                  </Button> -->

                  <Button on:click={() => isUserSettingsPanelOpen = true} variant="outline" size="icon">
                     <i class="ti ti-adjustments text-neutral-500"></i>
                  </Button>

                  {#if DEV_MODE}   
                     <Button on:click={() => isDevSettingsPanelOpen = true} variant="dev" size="icon">
                        <i class="ti ti-settings-code"></i>
                     </Button>
                  {/if}
               </div>
            {/if}
         </Card.Title>
         <!-- <Card.Description class="text-base">{ item.description }</Card.Description> -->
      </Card.Header>

      <Card.Content class="border border-neutral-800 rounded-lg p-3 mb-3">
         {#if isPageLoading}
            <div class="flex flex-col w-full space-y-3">
               <Skeleton class="w-full rounded h-[6rem]" />
               <Skeleton class="w-full rounded h-[2rem]" />
            </div>
         {:else}
            {#if flowBlocksList.length === 0}
               <div class="flex flex-col items-center">
                  <i class="ti ti-zoom-question text-muted-foreground"></i>
                  <p class="text-muted-foreground">Nenhum bloco para executar. Adicione um clicando no botão abaixo.</p>
               </div>
            {/if}
            <DraggableList
               bind:itemsList={flowBlocksList}
               let:item
               let:index
               class="flex flex-col gap-y-3"
            >
               <Card.Root class="rounded-lg">
                  <Card.Header class="p-4">
                     <Card.Title class="text-xl text-left flex justify-between">
                        {item.title}

                        <div class="space-x-2">
                           {#if DEV_MODE}
                              <Button on:click={() => openFlowBlockDialog(item)} variant="outline" size="icon">
                                 <i class="ti ti-code text-neutral-500"></i>
                              </Button>
                           {/if}

                           <Button on:click={() => removeFlowBlock(index)} variant="destructive" size="icon">
                              <i class="ti ti-x"></i>
                           </Button>
                        </div>
                     </Card.Title>
                     <Card.Description class="text-base"
                        >{item.description}</Card.Description
                     >
                  </Card.Header>
               </Card.Root>
            </DraggableList>

            <Button
               on:click={() => (isAddFlowBlockOpen = true)}
               class="mt-3 w-full"
               variant="ghost"
            >
               <i class="ti ti-plus"></i>
            </Button>
         {/if}
      </Card.Content>

      <Card.Footer class="flex flex-row space-x-3 p-0">
         {#if isPageLoading}
            <Skeleton class="h-[1.75rem] col-span-1" />
            <Skeleton class="h-[1.75rem] col-span-1" />
            <Skeleton class="h-[1.75rem] col-span-1" />
            <Skeleton class="h-[1.75rem] col-span-1" />
         {:else}
            <Button variant="ghost" size="icon" class="text-base col-span-1" on:click={openCombinedBlocksDialog}>
               <i class="ti ti-file-code"></i>
            </Button>

            {#if isPayloadRunning}
               <!-- <Button class="text-base col-span-1" disabled on:click={runCombinedPayload}>
                  <i class="ti ti-loader-2 animate-spin mr-2"></i>
                  Carga final sendo executada
               </Button> -->
               <Button variant="destructive" class="text-base w-[16rem]"
                  on:click={() => (isStopExecutionPanelOpen = true)}
               >
                  Interromper execução
               </Button>
            {:else}
               <Button disabled={flowBlocksList.length === 0} class="text-base w-[16rem]" on:click={runCombinedPayload}
                  >Executar carga final</Button
               >
            {/if}

            <Button disabled={flowBlocksList.length === 0} variant="outline" class="flex grow text-base" on:click={openEnvPanel}>
               Painel de Variáveis
            </Button>

            {#if !DEV_MODE}
               <Button variant="dev" size="icon" on:click={() => isDevAccessPanelOpen = true}>
                  <i class="ti ti-droplet-code"></i>
               </Button>
            {:else}
               <Button variant="ghost" size="icon" on:click={() => window.location.href = 'http://localhost:5173/compose'}>
                  <i class="ti ti-flower"></i>
               </Button>
            {/if}
         {/if}
      </Card.Footer>
   </Card.Root>
</main>

{#if env?.PUBLIC_ENV?.toUpperCase() === 'DEV' || DEV_MODE}
   <span class="absolute bottom-0 left-0 right-0 w-full bg-purple-600 text-base text-center font-code py-1">
      DEV MODE {#if env?.PUBLIC_ENV?.toUpperCase() === 'DEV'} / ENVIRONMENT {/if}
   </span>
{/if}

<AlertStopExecution bind:isPanelOpen={isStopExecutionPanelOpen} stopServerAction={ServerHandler.closeBrowser} />
<FlowBlockPayloadViewerPanel {toast} bind:isPanelOpen={isFlowBlockPanelOpen} bind:flowBlock={currentFlowBlock}/>
<EnvPanel bind:userSettings bind:combinedEnvPayload bind:isEnvPanelOpen bind:isPayloadRunning />
<AddFlowBlockPanel flowBlocks={data?.flowBlocks} {DEV_MODE} bind:combinedEnvPayload bind:flowBlocksList={flowBlocksList} bind:isPanelOpen={isAddFlowBlockOpen} />
<PayloadLogsPanel {toast} bind:isPanelOpen={isLogsPanelOpen} bind:isPayloadRunning />
<DevSettingsPanel {toast} bind:devSettings bind:isPanelOpen={isDevSettingsPanelOpen} />
<UserSettingsPanel bind:userSettings bind:isPanelOpen={isUserSettingsPanelOpen} />
<ComposeFlowbar />
<DevModeAccess bind:isPanelOpen={isDevAccessPanelOpen} />