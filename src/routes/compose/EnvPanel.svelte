<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import ComposeInput from "$lib/components/compose/ComposeInput.svelte";
    import ComposeInputList from "$lib/components/compose/ComposeInputList.svelte";
    import ComposeLabel from "$lib/components/compose/ComposeLabel.svelte";

    export let isEnvPanelOpen = false;
    export let combinedEnvPayload;
    
    let changesMade = false;
    let confirmAlertDialog = false;

    let testEnv = {
        link: {
            schema: {
                label: 'Link',
                tooltip: 'Do tipo link',
                placeholder: 'https://tabler.io/icons/icon/bug',
                type: 'text'
            },
            value: ''
        },
        credentials: {
            schema: {
                tooltip: 'As credenciais utilizadas pelo usuário no Kronus.',
                fields_type: 'object',
                fields: {
                    email: {
                        label: 'E-mail',
                        tooltip: 'O email do usuário.',
                        placeholder: 'user@email.com',
                        type: 'text'
                    },
                    password: {
                        label: 'Senha',
                        tooltip: 'A senha do usuário.',
                        placeholder: '********',
                        type: 'text'
                    }
                }
            },
            values: {
                email: '',
                password: ''
            }
        },
        banners: {
            schema: {
                tooltip: 'Os banners usados na campanhas (Eduzz ou Kiwify)',
                placeholder: 'https://site.com/banner-a1b2c3.png'
            },
            values: []
        }
    }

    $: envClone = structuredClone(combinedEnvPayload);

    function closeEnvPanel (state = true) {
        changesMade = state;

        if (changesMade) { 
            confirmAlertDialog = true;
            console.log('Cannot close. Changes were made');
            return;
        };
        confirmAlertDialog = false;
        isEnvPanelOpen = false;
    }

    function watchChanges (cb) {
        changesMade = true;
        if (typeof cb == 'function') { cb() };
    }


    function buildEnv () {
        let envPayload = {};
        console.log(envClone);

        for (let [name, props] of Object.entries(envClone)) {
            envPayload[name] = props.value || props.values;
        }

        console.log(envPayload);
        changesMade = false;
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
            <Dialog.Title class="text-2xl">Painel de variáveis</Dialog.Title>
            <Dialog.Description class="text-base">Todos os valores variáveis utilizados pelos blocos de fluxo</Dialog.Description>
        </Dialog.Header>

        <div class="max-h-[60vh] overflow-y-auto p-1">
            {#each Object.values(envClone) as data}
                {#if typeof data.value == 'string'}
                    <ComposeLabel tooltip={data.schema.tooltip}>{data.schema.label}</ComposeLabel>
                    <ComposeInput
                        inputType={data.schema.type}
                        placeholder={data.schema.placeholder}
                        on:change={(evt) => watchChanges(() => data.value = evt.target.value)} 
                    />
                {:else if Array.isArray(data.values)}
                    <ComposeLabel tooltip={data.schema.tooltip}>Banners</ComposeLabel>
                    <ComposeInputList 
                        listName="Banners" 
                        labelContent="Banners" 
                        items={data}
                        on:change={watchChanges} 
                    />
                    <!-- {#if Array.isArray(data.schema.fields)}
                    {:else}
                        <ComposeLabel tooltip={data.schema.tooltip}>Banners</ComposeLabel>
                        <ComposeInputList 
                            listName="Banners" 
                            labelContent="Banners" 
                            items={data}
                            on:change={watchChanges} 
                        />
                    {/if} -->
                {:else if data.schema.fields}
                    <ComposeLabel tooltip={data.schema.tooltip} groupType="object">Credenciais</ComposeLabel>
                    <div class="border border-neutral-800 rounded-md p-3 mt-1 mb-3 last:mb-0">
                        {#each Object.entries(data.schema.fields) as [field_name, field]}
                            <ComposeLabel tooltip={field.tooltip}>{ field.label }</ComposeLabel>
                            <ComposeInput 
                                inputType={field.type} 
                                placeholder={field.placeholder} 
                                on:change={(evt) => watchChanges(() => data.values[field_name] = evt.target.value)}
                            />
                        {/each}
                    </div>
                {:else}
                    <h1>INVALID</h1>
                    <pre>{ JSON.stringify(data, null, 3) }</pre>
                {/if}
            {/each}
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

<AlertDialog.Root bind:open={confirmAlertDialog}>
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