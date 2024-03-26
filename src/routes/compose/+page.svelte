<script>
   import { VERSION } from "$lib/store.js";
   import { LOGGER, TAGS } from "$lib/LogStore";
   import { onMount } from "svelte";
   import * as AlertDialog from "$lib/components/ui/alert-dialog";
   import * as Card from "$lib/components/ui/card";
   import Button from "$lib/components/ui/button/button.svelte";
   import DraggableList from "$lib/components/DraggableList.svelte";
   import EnvPanel from "./EnvPanel.svelte";
   import { initStruct } from "$lib/PayloadStore";
   import { ServerHandler } from "$lib/ServerHandler";
   import { toast } from "svelte-sonner";
   import { page } from "$app/stores";
   import FlowBlockPayloadViewerPanel from "./FlowBlockPayloadViewerPanel.svelte";
   import AddFlowBlockPanel from "./AddFlowBlockPanel.svelte";
   import PayloadLogsPanel from "./PayloadLogsPanel.svelte";
   import DevSettingsPanel from "./DevSettingsPanel.svelte";
   import Skeleton from "$lib/components/ui/skeleton/skeleton.svelte";
   import ComposeFlowbar from "$lib/components/compose/ComposeFlowbar.svelte";
   import { env } from "$env/dynamic/public"
   import { setContext } from "svelte";
   import UserSettingsPanel from "./UserSettingsPanel.svelte";

   let isFlowBlockPanelOpen = false;
   let isEnvPanelOpen = false;
   let isAddFlowBlockOpen = false;
   let isLogsPanelOpen = false;
   let isStopExecutionOpen = false;
   let isDevSettingsPanelOpen = false;
   let isUserSettingsPanelOpen = false;
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

   async function gitUpdate () {
      console.log('Updating...')
      const response = await fetch('/api/git-update');
      const result = await response.json();
      console.log(result);
   }

   onMount(() => {
      isPageLoading = false;
   });
</script>

<svelte:head>
   <title>Flow Composer</title>
</svelte:head>

<main class="flex flex-col items-center mt-3">
   <span class="flex text-neutral-500 font-semibold">Flow Composer • {VERSION}</span>

   <Card.Root class="flex flex-col p-3 border border-neutral-800 rounded-lg w-[40rem] mt-3">
      <Card.Header class="p-1 mb-3">
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

                  <Button on:click={gitUpdate} variant="outline" size="icon">
                     <i class="ti ti-download text-green-500"></i>
                  </Button>

                  <Button on:click={() => isUserSettingsPanelOpen = true} variant="outline" size="icon">
                     <i class="ti ti-adjustments text-neutral-500"></i>
                  </Button>

                  {#if DEV_MODE}   
                     <Button on:click={() => isDevSettingsPanelOpen = true} variant="dev" size="icon">
                        <i class="ti ti-settings-code text-purple-600"></i>
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

      <Card.Footer class="grid grid-cols-2 gap-y-2 gap-x-2 p-0">
         {#if isPageLoading}
            <Skeleton class="h-[1.75rem] col-span-1" />
            <Skeleton class="h-[1.75rem] col-span-1" />
            <Skeleton class="h-[1.75rem] col-span-1" />
            <Skeleton class="h-[1.75rem] col-span-1" />
         {:else}
            <Button variant="outline" class="text-base col-span-1" on:click={openCombinedBlocksDialog}>
               Carga final
            </Button>
            <Button disabled={flowBlocksList.length === 0} variant="outline" class="text-base col-span-1" on:click={openEnvPanel}>
               Painel de Variáveis
            </Button>

            {#if isPayloadRunning}
               <Button class="text-base col-span-1" disabled on:click={runCombinedPayload}>
                  <i class="ti ti-loader-2 animate-spin mr-2"></i>
                  Carga final sendo executada
               </Button>
            {:else}
               <Button disabled={flowBlocksList.length === 0} class="text-base col-span-1" on:click={runCombinedPayload}
                  >Executar carga final</Button
               >
            {/if}

            <Button disabled={!isPayloadRunning} variant="destructive" class="text-base col-span-1"
               on:click={() => (isStopExecutionOpen = true)}
            >
               Interromper execução
            </Button>
         {/if}
      </Card.Footer>
   </Card.Root>
</main>

<AlertDialog.Root bind:open={isStopExecutionOpen}>
   <AlertDialog.Content>
      <AlertDialog.Header>
         <AlertDialog.Title
            >Você gostaria mesmo de interromper a execução?</AlertDialog.Title
         >
         <AlertDialog.Description class="text-base"
            >Todas as operações já executadas não serão revertidas, podendo
            deixar efeitos colaterais.</AlertDialog.Description
         >
      </AlertDialog.Header>

      <AlertDialog.Footer>
         <AlertDialog.Cancel asChild let:builder>
            <Button
               variant="destructive"
               builders={[builder]}
               on:click={async () => await ServerHandler.closeBrowser()}
               >Interromper execução</Button
            >
         </AlertDialog.Cancel>
         <AlertDialog.Action>Continuar a execução</AlertDialog.Action>
      </AlertDialog.Footer>
   </AlertDialog.Content>
</AlertDialog.Root>

<FlowBlockPayloadViewerPanel bind:isPanelOpen={isFlowBlockPanelOpen} bind:flowBlock={currentFlowBlock}/>
<EnvPanel bind:userSettings bind:combinedEnvPayload bind:isEnvPanelOpen bind:isPayloadRunning />
<AddFlowBlockPanel {DEV_MODE} bind:combinedEnvPayload bind:flowBlocksList={flowBlocksList} bind:isPanelOpen={isAddFlowBlockOpen} />
<PayloadLogsPanel {toast} bind:isPanelOpen={isLogsPanelOpen} bind:isPayloadRunning />
<DevSettingsPanel bind:devSettings bind:isPanelOpen={isDevSettingsPanelOpen} />
<UserSettingsPanel bind:userSettings bind:isPanelOpen={isUserSettingsPanelOpen} />
<ComposeFlowbar />

{#if env?.PUBLIC_ENV?.toUpperCase() === 'DEV'}
   <span class="absolute bottom-0 w-full bg-purple-600 text-base text-center font-code py-1">DEV ENVIRONMENT</span>
{/if}