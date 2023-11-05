/* eslint-disable no-self-assign */
import { addFlowOperationBody } from "./operationsSystem";
import { convertToSnakeCase } from "$lib/utils";

let addOperationsModal, addFlowModal, payloadModal;
let flows, payload, payloadModalTextearea;
// eslint-disable-next-line no-unused-vars
let isFLowAPILoading;
let runFlowMessage;
let flowBuilderOperationsTemplates;

export function configFlowSystem (
    _flows, 
    _payload, 
    _add_operations_modal, 
    _add_flow_modal, 
    _payload_modal, 
    _payload_modal_textarea, 
    _is_flow_api_loading,
    _run_flow_message,
    _flow_builder_operations_templates
    ) {
    flows = _flows;
    payload = _payload;
    addOperationsModal = _add_operations_modal;
    addFlowModal = _add_flow_modal;
    payloadModal = _payload_modal;
    payloadModalTextearea = _payload_modal_textarea;
    isFLowAPILoading = _is_flow_api_loading;
    runFlowMessage = _run_flow_message;
    flowBuilderOperationsTemplates = _flow_builder_operations_templates;
}

export function addFlow (_new_flow_name) {
    flows[convertToSnakeCase(_new_flow_name)] = {
        env: {},
        flow: []
    };
    _new_flow_name = '';
    addFlowModal.close();
}

// $FLOW_BUILDER_OPERATION_TEMPLATES[_operation_command]
export function addOperation (_flow_operation_owner, _operation_command) {
    let newOperationBody = structuredClone(flowBuilderOperationsTemplates[_operation_command]);
    newOperationBody.id = Math.random().toString().slice(2);

    Object.entries(newOperationBody.input_fields).forEach(([input_name, input]) => {
        if (input.type === 'dropdown' && input_name === 'flow') {
            input.options = Object.keys(flows);
        }
    })
    
    flows[_flow_operation_owner].flow = [...flows[_flow_operation_owner].flow, newOperationBody];
    addOperationsModal.close();
}

export async function exportFlowsToJson () {
    Object.entries(flows).forEach(([flow_name, flow_body]) => {
        let flowBuffer = {
            env: {},
            flow: []
        };

        for (let block of flow_body.flow) {
            let commandBody = {};
            commandBody.command = block.command;

            if (block?.input_fields) {
                Object.entries(block.input_fields).forEach(([field_name, field]) => {
                    commandBody[field_name] = field.value;
                })
            }

            flowBuffer.flow.push(commandBody);
            flowBuffer.env = flow_body.env;
        }
        payload[flow_name] = flowBuffer;
    });
    
    payloadModalTextearea = JSON.stringify(payload, null, 3);
    payloadModal.open();
}

export async function sendFlowPayload () {
    isFLowAPILoading = true;

    if (payload.main_flow.flow.length > 0) {
        let response = await fetch('http://localhost:5173/api/run-flow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( payload )
        });

        response = await response.json();
        if (response.error) {
            runFlowMessage.type = 'error';
            runFlowMessage.message = response.error.message;
        } else {
            console.log(response);
            runFlowMessage.type = 'success';
            runFlowMessage.message = response.status.message;
        }
    } else {
        runFlowMessage.type = 'error';
        runFlowMessage.message = 'Empty Main Flow. Nothing to run.';
    }
    isFLowAPILoading = false;
}

export function loadFlow () {
    const payloadJSON = JSON.parse(payloadModalTextearea);

    Object.entries(payloadJSON).forEach(([ flow_name, flow_body ]) => {
        Object.values(flow_body.flow).forEach((operation) => {
            if ( flowBuilderOperationsTemplates[operation.command] ) {
                const operationBody = structuredClone( flowBuilderOperationsTemplates[operation.command] );
                
                if (operationBody?.input_fields) {
                    Object.entries(operationBody.input_fields).forEach(([key, value]) => {
                        value.value = operation[key];
                    })
                }
    
                operationBody.id = Math.random().toString().slice(2);
                addFlowOperationBody(flows, operationBody, flow_name);
                addOperationsModal.close();
                flows[flow_name].env = flow_body.env;
            }
        })
        console.log(flow_name);
    });

    payloadModal.close();
}

export function removeFlow (_flow_name) {
    if (_flow_name !== 'main_flow') {
        delete flows[_flow_name];
    }

    flows = flows;
}