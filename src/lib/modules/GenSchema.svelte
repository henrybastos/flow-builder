<script>
    import * as Dialog from "$lib/components/ui/dialog";
    import * as Tabs from "$lib/components/ui/tabs";
    import * as Select from "$lib/components/ui/select";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import { Textarea } from "$lib/components/ui/textarea";
    import Button from "$lib/components/ui/button/button.svelte";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    
    export let toast;
    export let isPanelOpen;
    export let payload;

    let generatedSchema;
    let generatedSchemaTextarea;
    let envPayload;
    let newBlockName;
    let schemaTags = [];

    let blockTemplate = `import type { EnvPayloadModel, Payload, BlockProps } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = @@env_payload@;

const PAYLOAD: Payload = @@payload@;

export const @@block_filename@: BlockProps = {
    title: '@@block_name@',
    block_id: '@@block_id@',
    description: 'A new Flow Block.',
    dependencies: [],
    tags: @@schema_tags@,
    payload: PAYLOAD,
    env_payload: ENV_PAYLOAD
}`;

    const TAGS = [
        {
            label: 'Eduzz',
            value: 'eduzz'
        },
        {
            label: 'Kiwify',
            value: 'kiwify'
        },
        {
            label: 'Dev',
            value: 'dev'
        },
        {
            label: 'YouTube',
            value: 'youtube'
        },
        {
            label: 'Kronus',
            value: 'kronus'
        },
        {
            label: 'Google',
            value: 'google'
        },
        {
            label: 'Tool',
            value: 'tool'
        }
    ]

    function setSchemaTags (tags) {
        schemaTags = tags.map(tag => tag.value);
    }

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
            'block_filename',
            'schema_tags'
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
        schemaFileContent.schema_tags = JSON.stringify(schemaTags);

        for (let placeholder of replacePlaceholders) {
            const replacePlaceholderRegex = new RegExp(`@@${placeholder}@`, 'g');
            blockTemplateCopy = blockTemplateCopy.replace(replacePlaceholderRegex, schemaFileContent[placeholder]);
        }

        generatedSchema = blockTemplateCopy;
        toast.success('Schema generated');
    }

    function copyGeneratedSchemaOutput () {
        if (navigator.clipboard && window.isSecureContext) {
            window.navigator.clipboard.writeText(generatedSchema);
        } else {
            console.warn(`Context is not secure (${ window.isSecureContext }). Using select and copy.`);
            generatedSchemaTextarea.select();
            document.execCommand('copy')
        }
        
        toast.success('Schema copied!');
   }

   function fetchPayload () {
        envPayload = structuredClone(JSON.stringify(payload, null, 3));
   }
</script>

<Dialog.Root bind:open={isPanelOpen}>
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
                <div class="flex flex-row items-center justify-between my-2">
                    <h3 class="text-lg my-3">Env payload</h3>
                    <Tooltip.Root>
                        <Tooltip.Trigger tabindex={-1}>
                            <Button on:click={fetchPayload} size="icon" variant="ghost">
                                <i class="ti ti-refresh"></i>
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content align="start" side="left">
                            <p class="text-base whitespace-nowrap">Fetches de current payload</p>
                        </Tooltip.Content>
                    </Tooltip.Root>
                </div>
                <Textarea class="h-[100rem] max-h-[50vh] text-base font-code resize-none" bind:value={envPayload} placeholder="Original payload"/>
                
                <div class="flex flex-row flex-wrap space-y-4">
                    <div class="flex flex-row items-center mt-3 gap-x-3 w-full">
                        <Label class="text-base whitespace-nowrap">Block name</Label>
                        <Input class="text-base flex flex-row grow" placeholder="My new block" type="text" bind:value={newBlockName}/>
                        <Select.Root onSelectedChange={setSchemaTags} multiple={true}>
                            <Select.Trigger class="w-fit">
                              <Select.Value class="whitespace-nowrap" placeholder="Select a tag" />
                            </Select.Trigger>
                            <Select.Content>
                                {#each TAGS as tag}
                                    <Select.Item on:change value={tag.value} label={tag.label}>
                                        {tag.label}
                                    </Select.Item>
                                {/each}
                            </Select.Content>
                            <Select.Input name="schemaTagsInput" />
                        </Select.Root>
                    </div>

                    <Button class="text-base" on:click={generateEnvPayloadSchema}>Generate schema</Button>
                </div>
            </Tabs.Content>

            <Tabs.Content value="schema">
                <h3 class="text-lg my-3">Schema</h3>
                <textarea id="copy-only-field" bind:this={generatedSchemaTextarea} class="absolute opacity-0">{ generatedSchema }</textarea>
                <Textarea class="h-[100rem] max-h-[50vh] text-base font-code resize-none" bind:value={generatedSchema} placeholder="Generated schema"/>

                <div class="flex flex-row gap-x-2 mt-4">
                    <Button variant="default" on:click={copyGeneratedSchemaOutput}>Copy schema</Button>
                </div>
            </Tabs.Content>
        </Tabs.Root>
    </Dialog.Content>
</Dialog.Root>