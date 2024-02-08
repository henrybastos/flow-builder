<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Card from "$lib/components/ui/card";
    import * as Sheet from "$lib/components/ui/sheet";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Tabs from "$lib/components/ui/tabs";
    import { Textarea } from "$lib/components/ui/textarea";
    import { FlowBlocks } from "$lib/flow-blocks/FlowBlocks";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import DraggableList from "$lib/components/DraggableList.svelte";
    
    let isFlowBlocksListOpen = false;
    let isSheetOpen = false;
    let generatedSchema;
    let envPayload;
    let newBlockName;

    let blockTemplate = `import type { EnvPayloadModel, Payload } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = @@env_payload@;

const PAYLOAD: Payload = @@payload@;

export const @@block_filename@ = {
    title: '@@block_name@',
    block_id: '@@block_id@',
    description: 'A new Flow Block.',
    payload: PAYLOAD,
    env_payload: ENV_PAYLOAD
}`

    function scanSchema (value, appendValue = true) {
        const templateSchema = structuredClone(value[0] || value);
        let schemaFields = {};

        for (let [key, value] of Object.entries(templateSchema)) {
            if (key.match(/(?<=__).*(?=__)/g)) {
                schemaFields[key] = value;
            } else {
                const label = [key.charAt(0).toUpperCase(), key.slice(1)].join('');
                
                if (typeof value === 'string') {
                    schemaFields[key] = {
                        ...(appendValue && {value: ''}),
                        schema: {
                        label: label,
                        tooltip: `${label} tooltip`,
                        placeholder: `${label} placeholder`,
                        type: 'text'
                        }
                    };
                } else if (value?.__options__) {
                    schemaFields[key] = {
                        ...(appendValue && {value: value.value}),
                        schema: {
                            label: label,
                            tooltip: `${label} tooltip`,
                            placeholder: label,
                            fields_type: 'select',
                            options: value.__options__
                        },
                    };
                } else if (Array.isArray(value)) {
                    schemaFields[key] = {
                        template_schema: Object.fromEntries(Object.keys(scanSchema(value, false)).map(key => [key, ''])),
                        schema: {
                            label: label,
                            tooltip: `${label} tooltip`,
                            fields_type: 'array',
                            fields: scanSchema(value, false)
                        },
                        ...(appendValue && {value: []}),
                    };
                }
            }
        }

        return schemaFields;
    }

    function generateEnvPayloadSchema () {
        let blockTemplateCopy = blockTemplate;
        const replacePlaceholders = [
            'env_payload',
            'payload',
            'block_name',
            'block_id',
            'block_filename'
        ]

        const parsedEnvPayload = JSON.parse(envPayload);
        let schemaFileContent = {};

        schemaFileContent.block_name = newBlockName;
        schemaFileContent.block_filename = newBlockName ? `${newBlockName.replace(/[\\/\:\*\?\<\>\|!@#$%¨&\s-]/gi, '')}Block` : 'NewBlock';
        schemaFileContent.block_id = crypto.randomUUID();
        schemaFileContent.env_payload = JSON.stringify(scanSchema(parsedEnvPayload.env), null, 3);
        schemaFileContent.payload = JSON.stringify(parsedEnvPayload, null, 3);

        for (let placeholder of replacePlaceholders) {
            const replacePlaceholderRegex = new RegExp(`@@${placeholder}@`, 'g');
            blockTemplateCopy = blockTemplateCopy.replace(replacePlaceholderRegex, schemaFileContent[placeholder]);
        }

        generatedSchema = blockTemplateCopy;
    }

    $: flowBlocksList = Object.values(FlowBlocks);
</script>

<svelte:window on:load={() => console.log('Hello!')}/>

<Sheet.Root bind:open={isSheetOpen}>
    <Sheet.Trigger>
        <Button debug-id="open-flow-blocks-button" variant="secondary">Flow Blocks</Button>
    </Sheet.Trigger>

    <Sheet.Content>
        <Sheet.Header class="mb-4">
            <Sheet.Title>Add Flow Block</Sheet.Title>
        </Sheet.Header>

        <DraggableList bind:itemsList={flowBlocksList} let:item class="flex flex-col gap-y-3">
            <Card.Root class="rounded-lg">
                <Card.Header class="p-4 pb-0">
                    <Card.Title class="text-xl text-left">{ item.title }</Card.Title>
                    <Card.Description class="text-base">{ item.description }</Card.Description>
                </Card.Header>
                <Card.Content class="p-4">
                <!-- <Button class="w-full" variant="outline">See code</Button> -->
                </Card.Content>
            </Card.Root>
        </DraggableList>

        <Button class="w-full mt-3 text-base" on:click={() => isFlowBlocksListOpen = true}>Generate Flow Block</Button>
    </Sheet.Content>
</Sheet.Root>

<Dialog.Root bind:open={isFlowBlocksListOpen}>
    <Dialog.Content class="min-w-[60rem] max-h-[80vh]">
        <Dialog.Header>
            <Dialog.Title>Generate Flow Block</Dialog.Title>
        </Dialog.Header>

        <Tabs.Root value="env_payload">
            <Tabs.List class="grid grid-cols-2 w-full">
                <Tabs.Trigger class="col-span-1" value="env_payload">Env payload</Tabs.Trigger>
                <Tabs.Trigger class="col-span-1" value="schema">Schema</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="env_payload">
                <h3 class="text-lg my-3">Env payload</h3>
                <Textarea class="h-[100rem] max-h-[50vh] text-base font-code" bind:value={envPayload} placeholder="Original payload"/>
                
                <div class="grid grid-cols-[min-content_auto] items-center mt-3 gap-x-3">
                    <Label class="text-base whitespace-nowrap">Block name</Label>
                    <Input class="text-base" placeholder="My new block" type="text" bind:value={newBlockName}/>
                </div>
            </Tabs.Content>

            <Tabs.Content value="schema">
                <h3 class="text-lg my-3">Schema</h3>
                <Textarea class="h-[100rem] max-h-[50vh] text-base font-code" bind:value={generatedSchema} placeholder="Generated schema"/>
            </Tabs.Content>
        </Tabs.Root>

        <Dialog.Footer>
            <Button class="text-base" on:click={generateEnvPayloadSchema}>Generate schema</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>