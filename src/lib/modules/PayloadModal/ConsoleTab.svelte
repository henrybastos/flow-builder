<script>
    import * as Collapsible from "$lib/components/ui/collapsible";
    import Button from "$lib/components/ui/button/button.svelte";
    import LogMessage from "$lib/components/LogMessage.svelte";
    import { slide } from "svelte/transition";
    import { LOGGER } from "$lib/LogStore";
    import { ServerHandler } from "$lib/ServerHandler";

    let isPayloadRunning = ServerHandler.isFLowAPILoading;
    let logsGroups = [];

    export let showDanger;
    export let showToast;

    function clearLogs () {
        showDanger( LOGGER.clearLogs, {
            danger_modal_title: 'Clear logs from Local Storage?', 
            danger_confirm: 'Clear' 
        });
    }

    $: logMessages = () => {
        let logs = Object.entries($LOGGER.messages).reverse();
        // logs.map(log => log.match(/RUNNING/gi))
    };

//     $: {
//         const loggerMessages = Object.values($LOGGER.messages);
//         const lastMessage = loggerMessages[loggerMessages.length - 1];
        
//         if (lastMessage) {
//             if (lastMessage.tag.type === 'running') {
//                 logsGroups = [ [lastMessage], ...logsGroups ]
//             } else {
//                 logsGroups[0] = [
//                     ...logsGroups[0],
//                     lastMessage
//                 ];
//             }
//         }
//    }

    function generateLogDownloadPayload (index) {
        const formattedLogs = logsGroups[index].map(log => `${ log.date } ${ log.time } ${ log.tag.label } ${ log.message }`).join('\n');
        return `data:text/json;charset=utf-8,${ encodeURIComponent(formattedLogs)}`;
   }
</script>

<section transition:slide={{ duration: 400 }}>
    <button class="clear-btn mb-2" on:click={clearLogs}>Clear logs</button>
    <div class="console_screen flex-col-reverse overflow-y-auto overflow-x-clip max-h-[36rem]">
        {#each Object.entries($LOGGER.messages).reverse() as [msg_key, msg], _ (msg_key)}
            <LogMessage on:clipboard_copy={() => showToast('Copied to clipboard!', 'success')} data={msg} />
        {/each}
    </div>

    <!-- {#if logsGroups.length === 0}
        <p class="w-full text-neutral-500 text-center">No logs yet</p>
    {:else}
        {#each logsGroups as logGroup, index}
            <Collapsible.Root class="border flex flex-row flex-wrap border-neutral-700 rounded-md p-2 m-2 space-x-1 group/collapsible">
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

                <Collapsible.Content class="p-3 w-full overflow-x-auto space-y-1">
                    {#each logGroup.slice(1) as msg, _ (Math.random().toString().slice(8))}
                        <LogMessage data={msg} />
                    {/each}
                </Collapsible.Content>
            </Collapsible.Root>
        {/each}
    {/if} -->
</section>