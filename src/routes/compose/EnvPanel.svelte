<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import ComposeComponent from "$lib/components/compose/ComposeComponent.svelte";
    import TooltipText from "$lib/components/compose/TooltipText.svelte";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import { page } from "$app/stores";

    export let isEnvPanelOpen = false;
    export let combinedEnvPayload;
    
    let envJsonPayloadValue = {};
    let changesMade = false;
    let isConfirmAlertDialogOpen = false;
    let isEditEnvJsonPanelOpen = false;
    
    const DEV_MODE = $page.url.searchParams.has('dev_mode');

    $: envClone = structuredClone(combinedEnvPayload);

    function closeEnvPanel (state = true) {
        changesMade = state;

        if (changesMade) {
            isConfirmAlertDialogOpen = true;
            console.log('Cannot close. Changes were made');
            return;
        };

        isConfirmAlertDialogOpen = false;
        isEnvPanelOpen = false;
    }

    function buildEnv () {
        for (let [name, props] of Object.entries(envClone)) {
            combinedEnvPayload[name].value = props.value;
        }

        console.log(combinedEnvPayload);
        changesMade = false;
    }

    function openEditEnvJsonPanel () {
        if (changesMade) { 
            isConfirmAlertDialogOpen = true;
            console.log('Cannot close. Changes were made');
            return;
        };

        if (!combinedEnvPayload) { combinedEnvPayload = envClone };
        if (typeof envJsonPayloadValue === 'string') { envJsonPayloadValue = JSON.parse(envJsonPayloadValue) };

        for (let [name, prop] of Object.entries(combinedEnvPayload)) {
            console.log(envJsonPayloadValue, prop);
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
            console.log(combinedEnvPayload);
            isEditEnvJsonPanelOpen = false;
        } catch (err) {
            console.error('Unable to parse new Env Payload', envJsonPayloadValue);
        }
    }
</script>

<Dialog.Root 
    closeOnEscape={!changesMade} 
    closeOnOutsideClick={!changesMade} 
    onOutsideClick={() => closeEnvPanel(changesMade)} 
    bind:open={isEnvPanelOpen}
>
    <Dialog.Content class="max-w-[60rem] max-h-[95vh] overflow-y-auto">
        <Dialog.Header>
            <Dialog.Title class="text-xl">
                Painel de variáveis
                {#if DEV_MODE}
                    <TooltipText text="Edit ENV JSON">
                        <Button class="ml-3" on:click={openEditEnvJsonPanel} variant="outline" size="icon"><i class="ti ti-code text-neutral-500"></i></Button>
                    </TooltipText>
                {/if}   
            </Dialog.Title>
            <Dialog.Description class="text-base">Todos os valores variáveis utilizados pelos blocos de fluxo</Dialog.Description>
        </Dialog.Header>

        <div class="max-h-[60vh] overflow-y-auto p-1 border-collapse">
            {#if envClone}
                {#each Object.values(envClone) as data}
                    <ComposeComponent 
                        bind:changesMade={changesMade} 
                        bind:data={data} 
                        bind:value={data.value}
                    />
                {/each}
            {/if}
        </div>

        <Dialog.Footer class="mt-2">
            <Button variant="outline" on:click={() => closeEnvPanel(changesMade)}>Cancelar</Button>
            
            <Button disabled={!changesMade} on:click={buildEnv} class="relative">
                {#if changesMade}    
                    <span class="absolute flex h-3 w-3 -top-1 -right-1">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                {/if}
                Salvar dados
            </Button>

        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<AlertDialog.Root bind:open={isConfirmAlertDialogOpen}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Você gostaria de salvar suas alterações?</AlertDialog.Title>
            <AlertDialog.Description>Esta operação não pode ser desfeita.</AlertDialog.Description>
        </AlertDialog.Header>

        <AlertDialog.Footer>
            <AlertDialog.Cancel on:click={() => closeEnvPanel(false)}>Descartar alterações</AlertDialog.Cancel>
            <AlertDialog.Action>Continuar editando</AlertDialog.Action>
          </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<Dialog.Root bind:open={isEditEnvJsonPanelOpen}>
    <Dialog.Content class="min-w-[45rem]">
        <Dialog.Header>
            <Dialog.Title>Edit ENV JSON</Dialog.Title>
        </Dialog.Header>

        <Textarea bind:value={envJsonPayloadValue} class="font-code text-base min-h-[10rem]" placeholder={JSON.stringify({ env: [ '...' ] }, null, 3)} />

        <Dialog.Footer>
            <Button variant="outline" on:click={() => isEditEnvJsonPanelOpen = false}>Cancel</Button>
            <Button on:click={applyEditEnvJsonPanelChanges}>Apply</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>