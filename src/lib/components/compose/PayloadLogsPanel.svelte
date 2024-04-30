<script>
   import * as Tabs from "$lib/components/ui/tabs";   
   import * as Dialog from "$lib/components/ui/dialog";
   import * as Collapsible from "$lib/components/ui/collapsible";
   import LogMessage from "$lib/components/LogMessage.svelte";
   import { LOGGER } from "$lib/LogStore";
   import Button from "$lib/components/ui/button/button.svelte";
   
   export let isPanelOpen = false;
   export let isPayloadRunning;
   export let toast;

   let logsGroups = [];
   let hasScreenshot = false;

   $: triggerToasts(isPayloadRunning);

   $: {
        const loggerMessages = Object.values($LOGGER.messages);
        const lastMessage = loggerMessages[loggerMessages.length - 1];
        
        if (lastMessage) {
            if (lastMessage.tag.type === 'running') {
                logsGroups = [ [lastMessage], ...logsGroups ];
            } else {
                if (logsGroups.length > 0) {
                    logsGroups[0] = [
                        ...logsGroups[0],
                        lastMessage
                    ];
                }
            }
        }
   }

   $: if (isPanelOpen) {
        (async () => {
            try {
                if ((await fetch('http://localhost:5173/last_error.png')).status === 200) {
                    hasScreenshot = true;
                }
            } catch (err) {
                hasScreenshot = false;
            }
        })()
   }

   function triggerToasts (_isPayloadRunning) {
       if (!_isPayloadRunning && logsGroups.length > 0) {
           for (let msg of logsGroups[0]) {
                switch (msg.tag.type) {
                    case 'error':
                        toast.error('Ocorreu um erro durante a execução dos blocos.');
                        break;
                    case 'warning':
                        toast.warning('Um alerta foi disparado, favor checar os logs.');
                        break;
                }
            }

            toast.info("Blocos executados.");
            toast.warning("Verifique manualmente os resultados da execução do fluxo.");
        }
   }

   function generateLogDownloadPayload (index) {
        const formattedLogs = logsGroups[index].map(log => `${ log.date } ${ log.time } ${ log.tag.label } ${ log.message }`).join('\n');
        return `data:text/json;charset=utf-8,${ encodeURIComponent(formattedLogs)}`;
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[90vw] justify-center">
       <Dialog.Header>
           <Dialog.Title class="text-xl">Logs</Dialog.Title>
           <Dialog.Description class="text-base">Shows the logs of the payload execution.</Dialog.Description>
       </Dialog.Header>

       <Tabs.Root active="logs_tab">
            <Tabs.List class="grid grid-cols-2 w-[87cqw] mb-4">
                <Tabs.Trigger class="col-span-1" value="logs_tab">Logs</Tabs.Trigger>
                <Tabs.Trigger class="col-span-1" value="screenshot_tab">Screenshot</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="logs_tab" class="h-[60vh]">
                <div class="flex flex-col-reverse overflow-y-auto max-h-full h-full ">
                    {#if logsGroups.length === 0}
                        <p class="text-neutral-500 text-center my-auto">No logs yet</p>
                    {:else}
                        {#each logsGroups as logGroup, index}
                            <Collapsible.Root class="border flex flex-col border-neutral-700 rounded-md p-2 m-2 space-x-1 group/collapsible max-w-[84cqw]">
                                <div class="flex flex-row">
                                    {#if isPayloadRunning && index === 0}
                                        <Button size="icon" disabled variant="ghost">
                                            <i class="ti ti-loader animate-spin"></i>
                                        </Button>
                                    {:else}
                                        <Button 
                                            size="icon" 
                                            variant="ghost"
                                            href={generateLogDownloadPayload(index)} 
                                            download={`logs_${ new Date().toLocaleTimeString() }_${ new Date().toLocaleDateString() }.json`}
                                        >
                                            <i class="ti ti-download"></i>
                                        </Button>
                                    {/if}
                                    <Collapsible.Trigger class="flex flex-row grow justify-between items-center px-1">
                                        <div class="inline-flex space-x-2">
                                            <LogMessage data={logGroup[0]} />
                                        </div>
            
                                        <div class="inline-flex justify-center items-center space-x-2 text-base">
                                            <p>{ logGroup.length }</p>
                                            <i class="ti ti-chevron-down group-data-[state=open]/collapsible:rotate-180"></i>
                                        </div>
                                    </Collapsible.Trigger>
                                </div>
        
                                <Collapsible.Content class="p-3 overflow-x-auto space-y-1">
                                    {#each logGroup.slice(1) as msg, _ (Math.random().toString().slice(8))}
                                        <LogMessage data={msg} />
                                    {/each}
                                </Collapsible.Content>
                            </Collapsible.Root>
                        {/each}
                    {/if}
               </div>
            </Tabs.Content>
            
            <Tabs.Content value="screenshot_tab" class="h-[60vh]">
                <div class="flex flex-col h-full">
                    {#if hasScreenshot}
                        {#key isPayloadRunning}
                            <img class="rounded-md object-contain h-full mx-auto" alt="No screenshot found." src="/last_error.png?{ Math.random().toString().slice(2,8) }" />
                        {/key}
                    {:else}
                        <p class="text-neutral-500 text-center my-auto">No Last Error screenshot</p>
                    {/if}
                </div>
            </Tabs.Content>
        </Tabs.Root>

        {#if isPayloadRunning}
            <p class="font-code font-semibold text-neutral-500"><i class="inline-flex w-fit h-fit ti ti-loader-2 animate-spin mr-1"></i> Processing operations...</p>
        {:else}
            <p class="font-code font-semibold text-neutral-500">All operations processed.</p>
        {/if}
   </Dialog.Content>
</Dialog.Root>
