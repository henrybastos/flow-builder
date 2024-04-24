import { FLOW_BUILDER_INPUT_FIELD_TEMPLATES } from "./InputFieldTemplates";

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
    keyboard_type: {
        command: 'keyboard_type',
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
    run_flow_iterations: {
        command: 'run_flow_iterations',
        enabled: true,
        label: 'Run Flow Iterations',
        icon: 'ti-repeat',
        input_fields: {
            flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.flow,
            iterations: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.iterations
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
    wait_for_dom_render: {
        command: 'wait_for_dom_render',
        enabled: true,
        label: 'Wait For DOM',
        icon: 'ti-crane',
        input_fields: {
            time: {
                type: 'text',
                label: 'Timeout time (ms)',
                placeholder: '15000',
                value: ''
            }
        }
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
    },
    download_image: {
        command: 'download_image',
        enabled: true,
        label: 'Download Image',
        icon: 'ti-download',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            attr: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.attr,
            filename: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.filename
        }
    },
    attach_to_iframe: {
        command: 'attach_to_iframe',
        enabled: true,
        label: 'Attach to IFrame',
        icon: 'ti-box-margin',
        input_fields: {
            xpath: {
                type: 'text',
                label: 'iFrame XPath',
                placeholder: '//iframe[@title="videoplayer"]',
                value: ''
            }
        }
    },
    detach_from_iframe: {
        command: 'detach_from_iframe',
        enabled: true,
        label: 'Detach from IFrame',
        icon: 'ti-box-padding'
    },
    new_page: {
        command: 'new_page',
        enabled: true,
        label: 'New page',
        icon: 'ti-folder-plus',
        input_fields: {
            page_id: {
                type: 'text',
                label: 'Page (ID)',
                placeholder: 'Titan Page',
                value: ''
            }
        }
    },
    select_page: {
        command: 'select_page',
        enabled: true,
        label: 'Select page',
        icon: 'ti-folders',
        input_fields: {
            page_id: {
                type: 'text',
                label: 'Page (ID)',
                placeholder: 'Titan Page',
                value: ''
            }
        }
    },
    wait_for_element: {
        command: 'wait_for_element',
        enabled: true,
        label: 'Wait for element',
        icon: 'ti-folders',
        input_fields: {
            target: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.target,
            response_slot: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.response_slot,
            timeout: {
                type: 'text',
                label: 'Timeout (ms)',
                placeholder: '15000',
                value: ''
            }
        }
    },
    eval_expression: {
        command: 'eval_expression',
        enabled: true,
        label: 'Evaluate expression',
        icon: 'ti-terminal-2',
        input_fields: {
            expression: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.expression
        }
    },
    branch_eval: {
        command: 'branch_eval',
        enabled: true,
        label: 'Branch Evaluate',
        icon: 'ti-terminal',
        input_fields: {
            expression: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.expression,
            success_flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.success_flow,
            error_flow: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.error_flow          
        }
    },
    screenshot: {
        command: 'screenshot',
        enabled: true,
        label: 'Screenshot',
        icon: 'ti-focus-centered',
        input_fields: {
            filename: FLOW_BUILDER_INPUT_FIELD_TEMPLATES.filename
        }
    }
};