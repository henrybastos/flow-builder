import { writable } from "svelte/store";

function createPayload () {
    const initStruct = {
        env: {},
        flows: {
            main_flow: {}
        }
    };

    /** @type {boolean} - If true, this flag blocks undefined flows. */
    let strict_flows = true;

    const payload_store = writable(structuredClone(initStruct));
    const { subscribe, update, set } = payload_store;
    
    return {
        subscribe,
        setStrictFlows: (_state) => {strict_flows = _state},
        setEnv: (_env) => update(_payload => {
            return {
                ..._payload,
                env: _env
            }
        }),
        loadFlow: (_flow_name, _new_flow) => update(_payload => {
            return {
                ..._payload,
                flows: {
                    ..._payload.flows,
                    [_flow_name]: _new_flow
                }
            }
        }),
        loadPayload: (_custom_payload) => set(_custom_payload),
        addFlow: (_flow_name) => update((_payload) => {
            return {
                env: { ..._payload.env },
                flows: {
                    ..._payload.flows,
                    [_flow_name]: {}
                } 
            }
        }),
        addCommand: (_flow_name, _command) => {
            update((_payload) => {
                if (strict_flows && !_payload.flows[_flow_name]) {
                    console.error(`[STRICT_FLOWS] Undefined flow: ${_flow_name}`);
                } else {
                    _command.id = Math.random().toString().slice(2);

                    return {
                        ..._payload,
                        flows: {
                            ..._payload.flows,
                            [_flow_name]: {
                                ...(_payload.flows[_flow_name] ?? {}),
                                [_command.id]: _command
                            }
                        }
                    }
                }
            })
        },
        moveOperation: (_flow_name, _operation, _direction) => {
            update(_payload => {
                const current_flow = _payload.flows[_flow_name];
                const currentOperationIndex = Object.keys(current_flow).indexOf(_operation.id);
                let current_flow_arr = Object.entries(current_flow);
                
                if (_direction === 'up' && currentOperationIndex !== 0) {
                    // Ads operation before it's own index
                    current_flow_arr.splice(currentOperationIndex - 1, 0, current_flow_arr[currentOperationIndex]);
                    // Removes it's own old copy
                    current_flow_arr.splice(currentOperationIndex + 1, 1);
                } else if (_direction === 'down' && currentOperationIndex < current_flow_arr.length) {
                    // Ads operation after it's own index
                    current_flow_arr.splice(currentOperationIndex + 2, 0, current_flow_arr[currentOperationIndex]);
                    // Removes it's own old copy
                    current_flow_arr.splice(currentOperationIndex, 1);
                }

                _payload.flows[_flow_name] = Object.fromEntries(current_flow_arr);

                return _payload;
            })
        },
        removeOperation: (_flow_name, _operation_id) => {
            update(_payload => {
                delete _payload.flows[_flow_name][_operation_id];
                return _payload;
            })
        },
        resetPayload: () => {
            set(structuredClone(initStruct));
        },
        resetFlows: () => {
            update(_payload => ({..._payload, flows: { main_flow: {} }}));
        }
    }
}

export default createPayload();