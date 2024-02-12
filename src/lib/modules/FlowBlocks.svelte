<script>
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Tabs from "$lib/components/ui/tabs";
    import { Textarea } from "$lib/components/ui/textarea";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    
    export let toast;

    let isFlowBlocksListOpen = false;
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
        let parsedEnvPayload
        let schemaFileContent = {};
        const replacePlaceholders = [
            'env_payload',
            'payload',
            'block_name',
            'block_id',
            'block_filename'
        ]

        try {
            parsedEnvPayload = JSON.parse(envPayload);
        } catch (err) {
            console.error(err);
            toast.error('Unable to parse the Env Payload');
        }

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
        toast.success('Schema generated');
    }
</script>

<svelte:window on:load={() => console.log('Hello!')}/>

<Button variant="secondary" on:click={() => isFlowBlocksListOpen = true}>Generate Flow Block</Button>

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
                <Textarea class="h-[100rem] max-h-[50vh] text-base font-code resize-none" bind:value={envPayload} placeholder="Original payload"/>
                
                <div class="grid grid-cols-[min-content_auto] items-center mt-3 gap-x-3">
                    <Label class="text-base whitespace-nowrap">Block name</Label>
                    <Input class="text-base" placeholder="My new block" type="text" bind:value={newBlockName}/>
                </div>
            </Tabs.Content>

            <Tabs.Content value="schema">
                <h3 class="text-lg my-3">Schema</h3>
                <Textarea class="h-[100rem] max-h-[50vh] text-base font-code resize-none" bind:value={generatedSchema} placeholder="Generated schema"/>
            </Tabs.Content>
        </Tabs.Root>

        <Dialog.Footer>
            <Button class="text-base" on:click={generateEnvPayloadSchema}>Generate schema</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>