<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import LogMessage from "$lib/components/LogMessage.svelte";
   import { LOGGER } from "$lib/LogStore";
   import * as Collapsible from "$lib/components/ui/collapsible";
    import Button from "$lib/components/ui/button/button.svelte";
   
   export let isPanelOpen = false;
   export let isPayloadRunning;
   export let toast;
   let logsGroups = [];

   $: triggerToasts(isPayloadRunning);

   $: {
        const loggerMessages = Object.values($LOGGER.messages);
        const lastMessage = loggerMessages[loggerMessages.length - 1];
        
        if (lastMessage) {
            if (lastMessage.tag.type === 'running') {
                logsGroups = [ [lastMessage], ...logsGroups ]
            } else {
                logsGroups[0] = [
                    ...logsGroups[0],
                    lastMessage
                ];
            }
        }
   }

   function triggerToasts (_isPayloadRunning) {
        if (!_isPayloadRunning) {
            for (let messages of logsGroups.slice(-1)) {
                for (let msg of messages) {
                    console.log(msg);
                    switch (msg.tag.type) {
                        case 'error':
                            toast.error('Ocorreu um erro durante a execução dos blocos.');
                            break;
                        case 'success':
                            toast.success('Carga executada com sucesso!');
                            break;
                        case 'warning':
                            toast.warning('Um aviso foi adicionado nos logs.');
                            break;
                    }
                }
            }

            toast.info("Blocos executados.");
        }
   }

   function generateLogDownloadPayload (index) {
        const formattedLogs = logsGroups[index].map(log => `${ log.date } ${ log.time } ${ log.tag.label } ${ log.message }`).join('\n');
        return `data:text/json;charset=utf-8,${ encodeURIComponent(formattedLogs)}`;
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[90vw]">
       <Dialog.Header>
           <Dialog.Title class="text-xl">Logs</Dialog.Title>
           <Dialog.Description>Shows the logs of the payload execution.</Dialog.Description>
       </Dialog.Header>

       <div class="console_screen flex-col-reverse overflow-y-auto overflow-x-clip max-h-[36rem] border">
            {#if logsGroups.length === 0}
                <p class="w-full text-neutral-500 text-center">No logs yet</p>
            {:else}
                {#each logsGroups as logGroup, index}
                    <Collapsible.Root class="border border-neutral-700 rounded-md p-2 m-2 group/collapsible">
                        <Collapsible.Trigger class="flex flex-row w-full justify-between px-1">
                            <div class="inline-flex space-x-2">
                                {#if isPayloadRunning && index === 0}
                                    <i class="ti ti-loader animate-spin"></i>
                                {/if}
                                <LogMessage data={logGroup[0]} />
                            </div>

                            <div class="inline-flex space-x-2">
                                <p>{ logGroup.length }</p>
                                <i class="ti ti-chevron-down group-data-[state=open]/collapsible:rotate-180"></i>
                            </div>
                        </Collapsible.Trigger>

                        <Collapsible.Content class="p-3 max-w-full overflow-x-auto space-y-1">
                            {#if isPayloadRunning && index === 0}
                                <Button disabled variant="ghost">Waiting for execution to end</Button>
                            {:else}
                                <Button 
                                    variant="ghost"
                                    href={generateLogDownloadPayload(index)} 
                                    download={`logs_${ new Date().toLocaleTimeString() }_${ new Date().toLocaleDateString() }.json`}
                                >
                                    Download logs
                                </Button>
                            {/if}

                            {#each logGroup.slice(1) as msg, _ (Math.random().toString().slice(8))}
                                <LogMessage data={msg} />
                            {/each}
                        </Collapsible.Content>
                    </Collapsible.Root>
                {/each}
            {/if}
       </div>

       {#if isPayloadRunning}
           <p class="font-code font-semibold text-neutral-500"><i class="inline-flex w-fit h-fit ti ti-loader-2 animate-spin mr-1"></i> Processing operations...</p>
       {:else}
           <p class="font-code font-semibold text-neutral-500">All operations processed.</p>
       {/if}
   </Dialog.Content>
</Dialog.Root>