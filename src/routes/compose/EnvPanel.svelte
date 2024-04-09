<script>
    import hljs from 'highlight.js/lib/core';
    import json from 'highlight.js/lib/languages/json';
    import hljs_theme from 'highlight.js/styles/tokyo-night-dark.min.css';
    import * as Dialog from "$lib/components/ui/dialog";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import * as Tabs from "$lib/components/ui/tabs";
    import Button from "$lib/components/ui/button/button.svelte";
    import ComposeComponent from "$lib/components/compose/ComposeComponent.svelte";
    import TooltipText from "$lib/components/compose/TooltipText.svelte";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import { ServerHandler } from '$lib/ServerHandler.js';
    import { page } from "$app/stores";
    import { toast } from "svelte-sonner";
    import { LOGGER, TAGS } from "$lib/LogStore";

    export let isEnvPanelOpen = false;
    export let combinedEnvPayload;
    export let isPayloadRunning;
    export let userSettings;
    
    let changesMade = false;
    let isConfirmAlertDialogOpen = false;
    let isEditEnvJsonPanelOpen = false;
    let activeTab = "input_tab";
    let outputCodeEl;
    let responseTextarea;
    let isAnyInputFocused = false;

    const DEV_MODE = $page.url.searchParams.has('dev_mode');

    hljs.registerLanguage('json', json);

    ServerHandler.logger = LOGGER;
    ServerHandler.logger_tags = TAGS;

    $: envJsonPayloadValue = {};
    $: envClone = structuredClone(combinedEnvPayload);
    $: if (activeTab == 'output_tab' && isEnvPanelOpen && !outputCodeEl?.dataset?.highlighted && outputCodeEl) { 
        hljs.highlightElement(outputCodeEl);
    };
    $: canClosePanel = userSettings?.close_env_panel_on_outside_click && !changesMade && !isAnyInputFocused;

    function closeEnvPanel () {
        // console.log('Closing Env Panel...');
        envClone = structuredClone(combinedEnvPayload);
        isConfirmAlertDialogOpen = false;
        isEnvPanelOpen = false;
        changesMade = false;
    }

    function handleCloseEnvPanel () {
        if (changesMade) {
            isConfirmAlertDialogOpen = true;
            return;
        };

        closeEnvPanel();
    }

    function buildEnv () {
        for (let [name, props] of Object.entries(envClone)) {
            combinedEnvPayload[name].value = props.value;
        }

        console.log(combinedEnvPayload, envClone);
        changesMade = false;
    }

    function openEditEnvJsonPanel () {
        if (changesMade) { 
            isConfirmAlertDialogOpen = true;
            console.log('Cannot close. Changes were made');
            return;
        };

        if (!combinedEnvPayload) { combinedEnvPayload = envClone };
        // if (typeof envJsonPayloadValue === 'string') { envJsonPayloadValue = JSON.parse(envJsonPayloadValue) };
        
        envJsonPayloadValue = {};
        console.log(combinedEnvPayload)

        for (let [name, prop] of Object.entries(combinedEnvPayload)) {
            envJsonPayloadValue[name] = prop.value;
        }

        envJsonPayloadValue = JSON.stringify(envJsonPayloadValue, null, 3);

        isEditEnvJsonPanelOpen = true;
    }

    function applyEditEnvJsonPanelChanges () {
        try {
            const newEnvPayload = JSON.parse(envJsonPayloadValue);
            for (let [name, prop] of Object.entries(newEnvPayload)) {
                combinedEnvPayload[name].value = prop;
            }
            isEditEnvJsonPanelOpen = false;
        } catch (err) {
            toast.error('Valores inválidos')
            console.error('Unable to parse new Env Payload', envJsonPayloadValue);
        }
    }

    function copyResponsePayloadToClipboard () {
        if (navigator.clipboard && window.isSecureContext) {
            window.navigator.clipboard.writeText(JSON.stringify(JSON.parse(ServerHandler.responsePayload), null ,3));
        } else {
            console.warn(`Context is not secure (${ window.isSecureContext }). Using select and copy.`);
            responseTextarea.select();
            document.execCommand('copy')
        }
        
        toast.success('Saída copiada para a Área de Transferência!');
    }

    function handleTabChange (tab_value) {
        activeTab = tab_value;
    }
</script>

<Dialog.Root 
    closeOnEscape={!changesMade} 
    bind:closeOnOutsideClick={canClosePanel}
    onOutsideClick={() => handleCloseEnvPanel()}
    bind:open={isEnvPanelOpen}
>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header class="h-min">
            <Dialog.Title class="text-xl">
                Painel de variáveis
                <TooltipText text="Edit ENV JSON">
                    <Button class="ml-3" on:click={openEditEnvJsonPanel} variant="outline" size="icon"><i class="ti ti-code text-neutral-500"></i></Button>
                </TooltipText>
            </Dialog.Title>
            <Dialog.Description class="text-base">Todos os valores variáveis utilizados pelos blocos de fluxo</Dialog.Description>
        </Dialog.Header>

        <Tabs.Root bind:value={activeTab} onValueChange={handleTabChange} class="w-full">
            <Tabs.List class="grid grid-cols-2 w-full">
                <Tabs.Trigger class="col-span-1" value="input_tab">Entrada</Tabs.Trigger>
                <Tabs.Trigger class="col-span-1" value="output_tab">Saída</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content data-active-tab={activeTab} value="input_tab" class="data-[active-tab=input\_tab]:flex flex-col h-[60vh] justify-between">
                <div class="overflow-y-auto p-1 border-collapse">
                    {#if Object.keys(envClone).length > 0}
                        {#each Object.entries(envClone) as [key, data]}
                            {#if !key.match(/^_.*/g)}    
                                <ComposeComponent 
                                    bind:changesMade={changesMade} 
                                    bind:data={data} 
                                    bind:value={data.value}
                                    on:focus={() => isAnyInputFocused = true}
                                    on:focusout={() => isAnyInputFocused = false}
                                />
                            {/if}
                        {/each}
                    {:else}
                        <p class="text-base w-full text-center text-neutral-500">
                            Nada pra preencher. Yay! <i class="ti ti-cactus"></i>
                        </p>
                    {/if}
                </div>

                <div class="flex flex-row-reverse gap-x-2">
                    <Button disabled={!changesMade} on:click={buildEnv} class="relative">
                        {#if changesMade}    
                            <span class="absolute flex h-3 w-3 -top-1 -right-1">
                                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                                <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                            </span>
                        {/if}
                        Salvar dados
                    </Button>

                    <Button variant="outline" on:click={handleCloseEnvPanel}>Cancelar</Button>
                </div>
            </Tabs.Content>
            
            <Tabs.Content data-active-tab={activeTab} value="output_tab" class="data-[active-tab=output\_tab]:flex flex-col h-[60vh] justify-between">
                {#key isPayloadRunning}
                    <textarea bind:this={responseTextarea} class="absolute opacity-0">{ JSON.stringify(JSON.parse(ServerHandler.responsePayload), null ,3) }</textarea>
                    <pre class="h-[50vh] rounded-lg overflow-x-auto w-[57rem] font-code p-5 mt-2" bind:this={outputCodeEl}>{ JSON.stringify(JSON.parse(ServerHandler.responsePayload), null ,3) }</pre>
                {/key}

                <div class="flex flex-row-reverse gap-x-2">
                    <Button variant="default" on:click={copyResponsePayloadToClipboard}>Copiar saída</Button>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={isConfirmAlertDialogOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Você gostaria de salvar suas alterações?</AlertDialog.Title>
            <AlertDialog.Description>Esta operação não pode ser desfeita.</AlertDialog.Description>
        </AlertDialog.Header>

        <AlertDialog.Footer>
            <AlertDialog.Cancel on:click={closeEnvPanel}>Descartar alterações</AlertDialog.Cancel>
            <AlertDialog.Action>Continuar editando</AlertDialog.Action>
          </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={isEditEnvJsonPanelOpen}>
    <Dialog.Content class="min-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title>Edit ENV JSON</Dialog.Title>
        </Dialog.Header>

        <Textarea bind:value={envJsonPayloadValue} class="font-code text-base min-h-[10rem] h-[75vh] resize-none" placeholder={JSON.stringify({ env: [ '...' ] }, null, 3)} />

        <Dialog.Footer>
            <Button variant="outline" on:click={() => isEditEnvJsonPanelOpen = false}>Cancel</Button>
            <Button on:click={applyEditEnvJsonPanelChanges}>Apply</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>