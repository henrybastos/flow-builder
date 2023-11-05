/* eslint-disable no-self-assign */

export function addFlowOperationBody (_flows, _operation_body, _flow_name) {
    Object.values(_operation_body.input_fields).forEach(input => {
        if (input.type === 'dropdown') {
            input.options = Object.keys(_flows);
            console.log(input.dropdown_label);
        }
    })
    
    if (_flows[_flow_name]) {
        _flows[_flow_name].flow = [..._flows[_flow_name].flow, _operation_body];
    } else {
        _flows[_flow_name] = { flow: [_operation_body] };
    }
}

export function moveOperation (_flows, _flow_key, _op, _direction) {
    const currentFlow = _flows[_flow_key].flow;
    const [currentOperationIndex] = getOperationIndex(currentFlow, _op.id);
    
    
    if (_direction === 'down') {
        if (currentOperationIndex < currentFlow.length) {
            // Ads operation after it's own index
            currentFlow.splice(currentOperationIndex + 2, 0, _op);
            // Removes it's own old copy
            currentFlow.splice(currentOperationIndex, 1);
        }
    } else if (_direction === 'up') {
        if (currentOperationIndex !== 0) {
            // Ads operation before it's own index
            currentFlow.splice(currentOperationIndex - 1, 0, _op);
            // Removes it's own old copy
            currentFlow.splice(currentOperationIndex + 1, 1);
        }
    }

    // Updates the DOM
    _flows[_flow_key] = _flows[_flow_key];
}

export function getOperationIndex (_flow, _op_id) {
    return Object.keys(_flow).map((op, index) => {
        if (_flow[op].id === _op_id) {
            return index;
        }
    }).filter(v => v !== undefined);
}

export function removeOperation (_flows, _flow_name, _id) {
    Object.entries(_flows[_flow_name].flow).forEach(([ index, operation ]) => {
        if (_id === operation.id) {
            _flows[_flow_name].flow.splice(index, 1);
        }
    });

    // Updates the DOM
    _flows[_flow_name] = _flows[_flow_name];
}