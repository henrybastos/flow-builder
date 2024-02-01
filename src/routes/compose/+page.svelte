<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import DraggableList from "$lib/components/DraggableList.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import SimpleInput from "$lib/components/SimpleInput.svelte";

    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Badge from "$lib/components/ui/badge/badge.svelte";
    import ArrayInput from "$lib/components/ArrayInput.svelte";

    let isFlowBlockDialogOpen = false;
    let isFullPayloadDialogOpen = true;

    let currentFlowBlock = {
        title: 'Eduzz - Login',
        block_id: 'A1B2C3D4',
        description: 'Faz login na Eduzz',
        payload: {}
    }

    let flowBlocks = [
        {
            title: 'Eduzz - Login',
            block_id: '5817351e-5c56-4059-a620-759145d938a5',
            description: 'Faz login na Eduzz',
            payload: {
                "env": {
                    "prop_01": "AAA",
                    "credentials": {
                        "email": "",
                        "password": ""
                    }
                },
                "main_flow": [
                    {
                        "command": "goto",
                        "enabled": true,
                        "target": "https://app.jivosite.com/settings/channels?lang=pt"
                    },
                    {
                        "command": "type",
                        "enabled": true,
                        "target": "//*/input[@type='email']",
                        "value": "%jivo_email%"
                    },
                    {
                        "command": "type",
                        "enabled": true,
                        "target": "//*/input[@type='password']",
                        "value": "%jivo_password%"
                    },
                    {
                        "command": "click",
                        "enabled": true,
                        "target": "//*/button[text()='Entrar']"
                    }
                ],
                "select_brand_flow": [
                    {
                        "command": "click",
                        "enabled": true,
                        "target": "//*/div[contains(text(), '%jivo_url%')]"
                    },
                    {
                        "command": "run_flow",
                        "enabled": true,
                        "flow": "instalation_flow"
                    },
                    {
                        "command": "set_payload_slot",
                        "enabled": true,
                        "response_slot": "operation_status",
                        "value": "Jivo already existed. Instalation code extracted."
                    }
                ],
            }
        },
        {
            title: 'Pegar ID dos produtos',
            block_id: '33fec0a0-0e0d-49fb-9430-24b189e211df',
            description: 'Retorna o ID de todos os produtos',
            payload: {
                "env": {
                    "prop_002": "BBB"
                },
                "main_flow": [
                    {
                        "command": "type",
                        "enabled": true,
                        "target": "//*/input[contains(@placeholder,'Busque')]",
                        "value": "%jivo_url%"
                    },
                    {
                        "command": "check_element",
                        "enabled": true,
                        "target": "//*[text()='%jivo_url%']",
                        "success_flow": "select_brand_flow",
                        "error_flow": "create_brand_flow"
                    }
                ],
                "create_brand_flow": [
                    {
                        "command": "reload",
                        "enabled": true
                    },
                    {
                        "command": "click",
                        "enabled": true,
                        "target": "//*/h3[text()='Chat online']"
                    },
                    {
                        "command": "click",
                        "enabled": true,
                        "target": "//*/button[text()='Adicionar site']"
                    },
                    {
                        "command": "type",
                        "enabled": true,
                        "target": "//*/input[@name='channelNameInput']",
                        "value": "%jivo_url%"
                    }
                ]
            }
        },
        {
            title: 'Criar Jivo',
            block_id: 'cfe560de-fa49-4e37-bf1d-3286da8e1fa2',
            description: 'Cria o Jivo Chat para o parceiro',
            payload: {
                "status": 'W.I.P.'
            }
        },
        {
            title: 'Fazer campanhas',
            block_id: '0a9bd0cd-4535-4271-bc83-705a807c2f1e',
            description: 'Cria e configura as campanhas',
            payload: {
                "status": 'W.I.P.'
            }
        }
    ];

    function combineAllPayloads () {
        let fullPayload = {};

        for (let block of flowBlocks) {
            for (let [prop_key, prop_value] of Object.entries(block.payload)) {
                if (!fullPayload[prop_key]) {
                    if (Array.isArray(prop_value)) {
                        fullPayload[prop_key] = [];
                    } else if (typeof fullPayload[prop_key] === 'object') {
                        fullPayload[prop_key] = {};
                    }
                } 

                // console.log(fullPayload[prop_key].length);
                if (Array.isArray(prop_value)) {
                    fullPayload[prop_key] = [
                        ...(fullPayload[prop_key]),
                        ...(prop_value)
                    ]
                } else {
                    fullPayload[prop_key] = {
                        ...(fullPayload[prop_key]),
                        ...(prop_value)
                    }
                }

            }
        }

        return structuredClone(fullPayload);
    }

    function openFlowBlockDialog (item) {
        currentFlowBlock = item;
        isFlowBlockDialogOpen = true;
    }

    function seeFullPayload () {
        isFullPayloadDialogOpen = true;
    }

    let testEnv = {
        link: '',
        credentials: {
            email: '',
            password: ''
        },
        banners: []
    }
</script>

<svelte:head>
    <title>Flow Builder • Compose</title>
</svelte:head>

<main class="flex flex-col p-3 border border-neutral-800 rounded-lg">
    <DraggableList bind:itemsList={flowBlocks} let:item class="flex flex-col gap-y-3">
        <Card.Root class="rounded-lg">
            <Card.Header class="p-4">
                <Card.Title class="text-xl text-left flex justify-between">
                    { item.title }
                    <Button on:click={() => openFlowBlockDialog(item)} variant="outline" size="icon"><i class="ti ti-code text-neutral-500"></i></Button>
                </Card.Title>
                <Card.Description class="text-base">{ item.description }</Card.Description>
            </Card.Header>
        </Card.Root>
    </DraggableList>

    <Button class="mt-3" on:click={seeFullPayload}>See full payload</Button>

    <Dialog.Root bind:open={isFlowBlockDialogOpen}>
        <Dialog.Content class="max-w-[60rem]">
            <Dialog.Header>
                <Dialog.Title>
                    { currentFlowBlock.title }
                    {#if currentFlowBlock.block_id}
                        <span class="text-neutral-500 font-code text-base pl-2">{ currentFlowBlock.block_id }</span>
                    {/if}
                </Dialog.Title>
                <Dialog.Description>{ currentFlowBlock.description }</Dialog.Description>
            </Dialog.Header>

            <pre class="max-h-[80vh] overflow-y-auto border border-neutral-700 rounded-lg p-4 font-code">{ JSON.stringify(currentFlowBlock.payload, null, 3) }</pre>
        </Dialog.Content>
    </Dialog.Root>

    <Dialog.Root bind:open={isFullPayloadDialogOpen}>
        <Dialog.Content class="max-w-[60rem]">
            <Dialog.Header>
                <Dialog.Title>Payload completo</Dialog.Title>
                <Dialog.Description>Todos os payloads de todos os blocos combinados.</Dialog.Description>
            </Dialog.Header>

            <div>
                <SimpleInput autofocus labelContent="Link" dataType="link" inputType="text" placeholderContent="https://tabler.io/icons/icon/bug"/>
                
                <ArrayInput items={testEnv.banners}/>
                <Label class="text-lg">Credentials <Badge class="ml-2 mb-1 uppercase text-neutral-300" variant="secondary">Dicionário</Badge></Label>
                <div class="border border-neutral-800 rounded-md p-3 mt-1 mb-3 last:mb-0">
                    <div>
                        <Label class="text-lg">E-mail</Label>
                        <Input class="text-base mt-1" placeholder="user@email.com" type="text"/>
                    </div>

                    <Label class="text-lg">Password</Label>
                    <Input class="text-base mt-1" placeholder="*******" type="text"/>
                </div>

                <Label class="text-lg">Banners <Badge class="ml-2 mb-1 uppercase text-neutral-300" variant="secondary">Lista</Badge></Label>
                <div class="flex flex-col border border-neutral-800 rounded-md p-3 gap-y-2 mt-1 mb-3 last:mb-0">
                    <SimpleInput inputType="text" placeholderContent="user@email.com"/>
                    <SimpleInput inputType="text" placeholderContent="*********"/>
        </div>
            </div>
        </Dialog.Content>
    </Dialog.Root>
</main>