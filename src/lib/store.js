import { writable } from "svelte/store";

console.log(`⣠⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⡄⣄⠀⠀⠀⠀\n⠀⠀⠀⢂⠏⡴⢂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣜⠳⡍⢢⠁⠀⠀⠀\n⠀⠀⠀⠈⠘⡔⣫⢞⣤⣶⣾⣶⣿⣿⣷⣶⣶⣿⣿⣶⣿⣶⣍⡣⢈⠆⠁⠀⠀⠀\n⠀⠀⠀⠀⠘⣽⠿⠿⠿⣿⣯⣿⡿⣯⢿⣿⣿⣿⡯⢜⡱⢫⣿⠷⠯⣄⠀⠀⠀⠀\n⠀⠀⠀⠀⢸⣽⠀⠀⡀⠀⠉⢷⣿⣿⣿⣿⣿⡿⣽⢪⣝⠋⡀⠀⠀⠸⠄⠀⠀⠀\n⠀⠀⠀⢠⣾⠇⠀⠀⠀⠀⠀⣀⠻⣿⣿⣿⣿⣿⣽⣧⢇⠀⠀⠀⠀⠈⣆⠀⠀⠀\n⠀⠀⠀⣿⢿⣿⣦⣤⣤⣤⣶⣿⣷⣻⣟⣿⣿⣿⣿⣾⣏⡳⢶⣤⣴⣴⡣⠆⠀⠀\n⠀⠀⢀⣯⣟⣿⣿⣿⣿⣿⣿⣿⣿⣷⣯⡟⣿⢻⠟⢷⠛⠝⠫⣟⠿⣭⡓⠆⠀⠀\n⠀⠀⠀⣿⣾⣟⡾⣽⢻⣿⣿⣿⣿⣿⠳⠉⠆⢉⠈⠄⠂⠈⠀⢈⣿⣲⠹⠀⠀⠀\n⠀⠀⠀⣿⣷⣏⣞⡽⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⣈⡷⣭⢳⡄⠀⠀\n⠀⠀⠀⣿⣿⣾⡽⣾⣿⣿⠿⡿⢛⠏⢯⡙⠲⡀⠀⠀⠀⢀⠰⡈⡑⠎⡹⠀⠀⠀\n⠀⣠⣾⣿⣿⣿⣿⣿⣏⣏⠳⡑⢊⠜⠠⠈⠁⠐⠀⠀⠀⠀⠂⠐⠀⠂⠡⠁⠀⠀\n⢠⣿⣿⣿⣿⣿⣿⣿⣿⣮⡱⣀⠂⡈⠀⠠⠀⠀⠀⠀⠀⠀⢀⠀⠀⠈⠀⠀⠀⠀\n⣾⣿⣿⣿⣿⣿⣿⣿⣿⣳⢿⡱⢃⠤⠁⡀⠀⠀⠀⠀⢀⠈⢀⠈⠀⠀⠀⠀⠀⠀\n⣿⣿⣿⣿⣿⣟⡻⣝⠞⣭⠲⡉⢋⠤⢁⠀⠈⠀⠄⠁⠀⠀⡀⠠⠀     \n`);

// */input[@class='icon-search-input']

// {
// "command": "scrape_attr",
// "target": "//*/textarea",
// "attr": "value",
// "response_slot": "jivo_id"
// }

function createUser () {
    const { subscribe, set, update } = writable({name: 'Roberto'});

    return {
        subscribe,
        setName: (name) => update(user => ({...user, name: name})),
        reset: () => set({})
    }
}

export const USER = createUser();

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
        placeholder: '%variable%',
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
    }
};

export const FLOW_BUILDER_OPERATION_TEMPLATES = writable({
    goto: {
        command: 'goto',
        label: 'Goto',
        icon: 'ti-send',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target_url
        }
    },
    reload: {
        command: 'reload',
        label: 'Reload',
        icon: 'ti-refresh'
    },
    click: {
        command: 'click',
        label: 'Click',
        icon: 'ti-pointer',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target_url
        }
    },
    user_click: {
        command: 'user_click',
        label: 'User click',
        icon: 'ti-hand-click',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target_url
        }
    },
    scrape_attr: {
        command: 'scrape_attr',
        label: 'Scrape Attribute',
        icon: 'ti-brackets-angle',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            attr: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.attr,
            response_slot: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.response_slot
        }
    },
    scrape_multiple_attr: {
        command: 'scrape_multiple_attr',
        label: 'Scrape Multiple Values',
        icon: 'ti-brackets',
        input_fields: {
            response_slot: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.response_slot,
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            attr: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.attr
        }
    },
    type: {
        command: 'type',
        label: 'Type',
        icon: 'ti-keyboard',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            value: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.value
        }
    },
    check_element: {
        command: 'check_element',
        label: 'Check Element',
        icon: 'ti-zoom-scan',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            success_flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.success_flow,
            error_flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.error_flow,
        }
    },
    run_flow: {
        command: 'run_flow',
        label: 'Run Flow',
        icon: 'ti-zoom-scan',
        input_fields: {
            flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.flow
        }
    },
    run_flow_for_each: {
        command: 'run_flow_for_each',
        label: 'Run Flow For Each',
        icon: 'ti-zoom-scan',
        input_fields: {
            flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.flow,
            env_var:  FLOW_BUILDER_INPUT_FIELD_TEMPLATES.env_var,
        }
    },
    set_payload_slot: {
        command: 'set_payload_slot',
        label: 'Set Payload Slot',
        icon: 'ti-zoom-scan',
        input_fields: {
            response_slot: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.response_slot,
            value: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.value
        }
    },
    repeat_flow: {
        command: 'repeat_flow',
        label: 'WIP Repeat Flow',
        icon: 'ti-repeat',
        input_fields: {
            method: {
                type: 'dropdown',
                label: 'Method',
                options: [
                    {
                        value: 'by_env_array',
                        label: 'By Env Array'
                    },
                    {
                        value: 'by_flow',
                        label: 'By flow'
                    }
                ],
                value: '',
            }
        }
    },
    repeater: {
        command: 'repeater',
        label: 'WIP Repeater',
        icon: 'ti-zoom-scan',
        input_fields: {
            add_btn: {
                type: 'btn',
                label: 'Add group',
            },
            value: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.value
        }
    },
    chrome_picker_set_color: {
        command: 'chrome_picker_set_color',
        label: 'Chrome Picker Set Color',
        input_fields: {
            color: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.color,
            trigger_target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.trigger_target,
            picker_target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.picker_target,
        }
    }
}) 