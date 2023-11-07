import { writable } from "svelte/store";

function createPayload () {
    const initStruct = {
        env: {},
        main_flow: []
    };

    /** @type {boolean} - If true, this flag blocks undefined flows. */
    let strict_flows = true;

    const { subscribe, update, set } = writable(structuredClone(initStruct));
    
    return {
        subscribe,
        setStrictFlows: (_state) => {strict_flows = _state},
        loadPreset: (_preset) => set(_preset),
        addFlow: (_flow_name) => update((_payload) => {
            return {
                ..._payload, 
                [_flow_name]: []
            }
        }),
        addCommand: (_flow_name, _command) => {
            update((_payload) => {
                if (strict_flows && !_payload[_flow_name]) {
                    console.error(`[STRICT_FLOWS] Undefined flow: ${_flow_name}`);
                } else {
                    _command.id = Math.random().toString().slice(2);
                    return {
                        ..._payload,
                        [_flow_name]: {
                            ...(_payload[_flow_name] ?? {}),
                            [_command.id]: _command
                        }
                    }
                }
            })
        },
        moveOperation: (_flow_name, _operation, _direction) => {
            console.log(_flow_name, _operation, _direction);
            update(_payload => {
                const current_flow = _payload[_flow_name];
                const currentOperationIndex = Object.keys(current_flow).indexOf(_operation.id);
                
                if (currentOperationIndex !== 0) {
                    // Ads operation before it's own index
                    Object.fromEntries(Object.entries(current_flow).splice(currentOperationIndex - 1, 0, _operation));
                    // Removes it's own old copy
                    Object.fromEntries(Object.entries(current_flow).splice(currentOperationIndex + 1, 1));
                }

                console.log(current_flow);
                console.log(_payload);

                return _payload;
            })
        },
        removeOperation: (_flow_name, _operation_id) => {
            update(_payload => {
                delete _payload[_flow_name][_operation_id];
                return _payload;
            })
        },
        resetPayload: () => {
            set(structuredClone(initStruct));
            localStorage.removeItem('presets');
        }
    }
}

export default createPayload();