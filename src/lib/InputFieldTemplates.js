export const FLOW_BUILDER_INPUT_FIELD_TEMPLATES = {
    flow: {
        type: 'dropdown',
        label: 'Flow',
        options: [],
        value: ''
    },
    group_name: {
        type: 'text',
        label: 'Group name',
        value: ''
    },
    target: {
        type: 'text',
        label: 'Target',
        placeholder: 'XPath',
        value: ''
    },
    color: {
        type: 'text',
        label: 'Color',
        placeholder: '#FF00FF',
        value: ''
    },
    env_var: {
        type: 'text',
        label: 'Env variable',
        placeholder: '@@variable@',
        value: ''
    },
    env_query: {
        type: 'text',
        label: 'Env query',
        placeholder: 'var1.var2.var3',
        value: ''
    },
    target_url: {
        type: 'text',
        name: '',
        label: 'Target',
        placeholder: 'URL',
        value: ''
    },
    success_flow: {
        type: 'dropdown',
        label: 'Success Flow',
        options: [],
        value: ''
    },
    error_flow: {
        type: 'dropdown',
        label: 'Error flow',
        options: [],
        value: ''
    },
    picker_target: {
        type: 'text',
        label: 'Picker Target',
        placeholder: 'XPath',
        value: ''
    },
    trigger_target: {
        type: 'text',
        label: 'Trigger Target',
        placeholder: 'XPath',
        value: ''
    },
    attr: {
        type: 'text',
        label: 'Attribute',
        placeholder: 'innerText',
        value: ''
    },
    regex: {
        code_font: true,
        type: 'text',
        label: 'Regex',
        placeholder: '(?<=@@)[^@]+(?=@)',
        value: ''
    },
    param: {
        type: 'text',
        label: 'Parameter',
        placeholder: 'list',
        value: ''
    },
    response_slot: {
        type: 'text',
        label: 'Response Slot',
        placeholder: 'response.attr',
        value: ''
    },
    value: {
        type: 'text',
        label: 'Value',
        placeholder: 'Value',
        value: ''
    },
    iterations: {
        type: 'text',
        label: 'Number of Iterations',
        placeholder: '8',
        value: ''
    },
    filename: {
        type: 'text',
        label: 'Filename',
        placeholder: 'file.txt',
        value: ''
    },
    key: {
        type: 'dropdown',
        label: 'Key',
        options: [
            {
                label: 'Enter',
                value: 'Enter'
            },
            {
                label: 'Esc',
                value: 'Escape'
            },
            {
                label: 'End',
                value: 'End'
            },
            {
                label: 'Backspace',
                value: 'Backspace'
            },
            {
                label: 'Tab',
                value: 'Tab'
            }
        ],
        value: ''
    },
    expression: {
        code_font: true,
        type: 'textarea',
        label: 'Expression',
        placeholder: 'window.location.href = "http://google.com.br";',
        value: ''
    }
};