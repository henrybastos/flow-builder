console.log(`⣠⠀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠠⡄⣄⠀⠀⠀⠀\n⠀⠀⠀⢂⠏⡴⢂⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣰⣜⠳⡍⢢⠁⠀⠀⠀\n⠀⠀⠀⠈⠘⡔⣫⢞⣤⣶⣾⣶⣿⣿⣷⣶⣶⣿⣿⣶⣿⣶⣍⡣⢈⠆⠁⠀⠀⠀\n⠀⠀⠀⠀⠘⣽⠿⠿⠿⣿⣯⣿⡿⣯⢿⣿⣿⣿⡯⢜⡱⢫⣿⠷⠯⣄⠀⠀⠀⠀\n⠀⠀⠀⠀⢸⣽⠀⠀⡀⠀⠉⢷⣿⣿⣿⣿⣿⡿⣽⢪⣝⠋⡀⠀⠀⠸⠄⠀⠀⠀\n⠀⠀⠀⢠⣾⠇⠀⠀⠀⠀⠀⣀⠻⣿⣿⣿⣿⣿⣽⣧⢇⠀⠀⠀⠀⠈⣆⠀⠀⠀\n⠀⠀⠀⣿⢿⣿⣦⣤⣤⣤⣶⣿⣷⣻⣟⣿⣿⣿⣿⣾⣏⡳⢶⣤⣴⣴⡣⠆⠀⠀\n⠀⠀⢀⣯⣟⣿⣿⣿⣿⣿⣿⣿⣿⣷⣯⡟⣿⢻⠟⢷⠛⠝⠫⣟⠿⣭⡓⠆⠀⠀\n⠀⠀⠀⣿⣾⣟⡾⣽⢻⣿⣿⣿⣿⣿⠳⠉⠆⢉⠈⠄⠂⠈⠀⢈⣿⣲⠹⠀⠀⠀\n⠀⠀⠀⣿⣷⣏⣞⡽⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⣈⡷⣭⢳⡄⠀⠀\n⠀⠀⠀⣿⣿⣾⡽⣾⣿⣿⠿⡿⢛⠏⢯⡙⠲⡀⠀⠀⠀⢀⠰⡈⡑⠎⡹⠀⠀⠀\n⠀⣠⣾⣿⣿⣿⣿⣿⣏⣏⠳⡑⢊⠜⠠⠈⠁⠐⠀⠀⠀⠀⠂⠐⠀⠂⠡⠁⠀⠀\n⢠⣿⣿⣿⣿⣿⣿⣿⣿⣮⡱⣀⠂⡈⠀⠠⠀⠀⠀⠀⠀⠀⢀⠀⠀⠈⠀⠀⠀⠀\n⣾⣿⣿⣿⣿⣿⣿⣿⣿⣳⢿⡱⢃⠤⠁⡀⠀⠀⠀⠀⢀⠈⢀⠈⠀⠀⠀⠀⠀⠀\n⣿⣿⣿⣿⣿⣟⡻⣝⠞⣭⠲⡉⢋⠤⢁⠀⠈⠀⠄⠁⠀⠀⡀⠠⠀     \n`);

// */input[@class='icon-search-input']

// {
// "command": "scrape_attr",
// "target": "//*/textarea",
// "attr": "value",
// "response_slot": "jivo_id"
// }

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
        placeholder: '(?<=%).[^%]*(?=%)',
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
            }
        ],
        value: ''
    }
};

/**
 * @typedef {Object} Operation
 * @property {string} command
 * @property {string} label
 * @property {string} icon
 * @property {'btn'} type
 */

export const FLOW_BUILDER_OPERATION_TEMPLATES = {
    goto: {
        command: 'goto',
        enabled: true,
        label: 'Goto',
        icon: 'ti-send',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target_url
        }
    },
    reload: {
        command: 'reload',
        enabled: true,
        label: 'Reload',
        icon: 'ti-refresh'
    },
    click: {
        command: 'click',
        enabled: true,
        label: 'Click',
        icon: 'ti-pointer',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target_url
        }
    },
    user_click: {
        command: 'user_click',
        enabled: true,
        label: 'User click',
        icon: 'ti-hand-click',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target_url
        }
    },
    scrape_attr: {
        command: 'scrape_attr',
        enabled: true,
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
        enabled: true,
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
        enabled: true,
        label: 'Type',
        icon: 'ti-keyboard',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            value: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.value
        }
    },
    check_element: {
        command: 'check_element',
        enabled: true,
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
        enabled: true,
        label: 'Run Flow',
        icon: 'ti-arrow-bear-right-2',
        input_fields: {
            flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.flow
        }
    },
    run_flow_for_each: {
        command: 'run_flow_for_each',
        enabled: true,
        label: 'Run Flow For Each',
        icon: 'ti-zoom-scan',
        input_fields: {
            flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.flow,
            env_var:  FLOW_BUILDER_INPUT_FIELD_TEMPLATES.env_var,
        }
    },
    set_payload_slot: {
        command: 'set_payload_slot',
        enabled: true,
        label: 'Set Payload Slot',
        icon: 'ti-zoom-scan',
        input_fields: {
            response_slot: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.response_slot,
            value: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.value
        }
    },
    repeat_flow: {
        disabled: true,
        command: 'repeat_flow',
        enabled: true,
        label: 'WIP Repeat Flow',
        icon: 'ti-repeat',
        input_fields: {
            method: {
                type: 'text',
                label: 'No. of times',
                value: '',
            }
        }
    },
    repeater: {
        disabled: true,
        command: 'repeater',
        enabled: true,
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
        enabled: true,
        label: 'Chrome Picker Set Color',
        input_fields: {
            color: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.color,
            trigger_target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.trigger_target,
            picker_target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.picker_target,
        }
    },
    wait_for_selector: {
        command: 'wait_for_selector',
        enabled: true,
        label: 'Wait For Selector',
        icon: 'ti-clock-search',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            timeout: {
                type: 'text',
                label: 'Timeout time | secs',
                placeholder: '15000',
                value: ''
            }
        }
    },
    wait_seconds: {
        command: 'wait_seconds',
        enabled: true,
        label: 'Wait Seconds',
        icon: 'ti-clock',
        input_fields: {
            time: {
                type: 'text',
                label: 'Timeout time (ms)',
                placeholder: '15000',
                value: ''
            }
        }
    },
    wait_for_navigation: {
        command: 'wait_for_navigation',
        enabled: true,
        label: 'Wait For Navigation',
        icon: 'ti-speedboat'
    },
    close_browser: {
        command: 'close_browser',
        enabled: true,
        label: 'Close browser',
        icon: 'ti-clock'
    },
    extract_param_from_url: {
        command: 'extract_param_from_url',
        enabled: true,
        label: 'Extract parameter from URL',
        icon: 'ti-cut',
        input_fields: {
            param: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.param,
            response_slot: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.response_slot
        }
    },
    extract_route_from_url: {
        command: 'extract_route_from_url',
        enabled: true,
        label: 'Extract route',
        icon: 'ti-regex',
        input_fields: {
            regex: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.regex,
            response_slot: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.response_slot
        }
    },
    set_env: {
        command: 'set_env',
        enabled: true,
        label: 'Set Env var',
        icon: 'ti-database-edit',
        input_fields: {
            env_query: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.env_query,
            value: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.value
        }
    },
    press_key: {
        command: 'press_key',
        enabled: true,
        label: 'Press key',
        icon: 'ti-command',
        input_fields: {
            key: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.key
        }
    }
};