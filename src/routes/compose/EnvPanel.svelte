<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import ComposeInput from "$lib/components/compose/ComposeInput.svelte";
    import ComposeInputList from "$lib/components/compose/ComposeInputList.svelte";
    import ComposeLabel from "$lib/components/compose/ComposeLabel.svelte";

    export let isEnvPanelOpen = false;
    
    let changesMade = false;
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
                groupType: 'object',
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

    function closeEnvPanel () {
        if (changesMade) { 
            console.log('Cannot close. Changes were made');
            return;
        };
        isEnvPanelOpen = false;
    }

    function watchChanges (cb) {
        changesMade = true;
        if (typeof cb == 'function') { cb() };
    }

    function buildEnv () {
        console.log(testEnv);
    }
</script>

<Dialog.Root closeOnOutsideClick={!changesMade} onOutsideClick={closeEnvPanel} bind:open={isEnvPanelOpen}>
    <Dialog.Content class="max-w-[60rem]">
        <Dialog.Header>
            <Dialog.Title class="text-2xl">Painel de variáveis</Dialog.Title>
            <Dialog.Description class="text-base">Todos os valores variáveis utilizados pelos blocos de fluxo</Dialog.Description>
        </Dialog.Header>

        <div class="max-h-[80vh] overflow-y-auto p-1">
            {#each Object.values(testEnv) as data}
                {#if typeof data.value == 'string'}
                    <ComposeLabel tooltip={data.schema.tooltip}>{data.schema.label}</ComposeLabel>
                    <ComposeInput 
                        autofocus
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

        <div class="hidden">
            <ComposeLabel tooltip={testEnv.link.schema.tooltip}>{testEnv.link.schema.label}</ComposeLabel>
            <ComposeInput 
                on:change={(evt) => testEnv.link.value = evt.target.value} 
                autofocus
                inputType={testEnv.link.schema.type}
                placeholder={testEnv.link.schema.placeholder}
            />
            
            <ComposeLabel tooltip={testEnv.banners.schema.tooltip}>Banners</ComposeLabel>
            <ComposeInputList 
                on:change={watchChanges} 
                listName="Banners" 
                labelContent="Banners" 
                items={testEnv.banners}
            />

            <ComposeLabel tooltip={testEnv.credentials.schema.tooltip} groupType="object">Credenciais</ComposeLabel>
            <div class="border border-neutral-800 rounded-md p-3 mt-1 mb-3 last:mb-0">
                {#each Object.entries(testEnv.credentials.schema.fields) as [field_name, field]}
                    <ComposeLabel tooltip={field.tooltip}>{ field.label }</ComposeLabel>
                    <ComposeInput inputType={field.type} placeholder={field.placeholder} on:change={(evt) => testEnv.credentials.values[field_name] = evt.target.value}/>
                {/each}
            </div>

            <!-- <Label class="text-lg">Banners <Badge class="ml-2 mb-1 uppercase text-neutral-300" variant="secondary">Lista</Badge></Label>
            <div class="flex flex-col border border-neutral-800 rounded-md p-3 gap-y-2 mt-1 mb-3 last:mb-0">
                <ComposeInput inputType="text" placeholderContent="user@email.com"/>
                <ComposeInput inputType="text" placeholderContent="*********"/>
            </div> -->
        </div>

        <Dialog.Footer class="mt-2">
            <Button variant="outline" on:click={closeEnvPanel}>Cancelar</Button>
            <Button disabled={!changesMade} class="relative">
                {#if changesMade}    
                    <span class="absolute flex h-3 w-3 -top-1 -right-1">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </span>
                {/if}
                Salvar dados
            </Button>
            <Button on:click={buildEnv}>Build</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>