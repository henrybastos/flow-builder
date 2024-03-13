import { writable } from "svelte/store";
import { genUUID } from "./utils";

export const initStruct = {
    config: {
        ws_endpoint: "",
        close_browser_on_finish: false,
        close_browser_on_cancel_request: false,
        headless: false
    },
    env: {
        _$fb: {
            pages: {
                main_page: 'main_page'
            }
        }
    },
    flows: {
        main_flow: {}
    }
};

function createPayload () {
    /** @type {boolean} - If true, this flag blocks undefined flows. */
    let strict_flows = true;

    const payload_store = writable(structuredClone(initStruct));
    const { subscribe, update, set } = payload_store;
    
    return {
        subscribe,
        // Fixes some old presets without the config object
        _fix_fixNullConfig: () => {
            update(_payload => {
                let initConfig = structuredClone(initStruct.config);
                
                Object.keys(initConfig).forEach(config_name => {
                    if (!_payload?.config?.[config_name]) {
                        // console.log(`[UNDEFINED CONFIG] Overwriting undefined preset config <${ config_name }> to <${ initConfig[config_name] }>`);
                        _payload = {
                            ..._payload,
                            config: {
                                ...(_payload?.config || []),
                                [config_name]: initConfig[config_name]
                            }
                        };
                    }
                })
                return {
                    ..._payload
                }
            })
        },
        loadConfig: (_config) => {
            update(_payload => {
                return {
                    ..._payload,
                    config: _config
                }
            })
        },
        setConfig: (_config, _value) => {
            update(_payload => {
                return {
                    ..._payload,
                    config: {
                        ..._payload.config,
                        [_config]: _value
                    }
                }
            })
        },
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
        loadBlankPayload: () => set(initStruct),
        loadPayload: (_custom_payload) => set(_custom_payload),
        addFlow: (_flow_name) => update((_payload) => {
            return {
                env: { ..._payload.env },
                flows: {
                    ..._payload.flows,
                    [_flow_name]: []
                } 
            }
        }),
        addOperation: (_flow_name, _operation) => {
            update((_payload) => {
                if (strict_flows && !_payload.flows[_flow_name]) {
                    console.error(`[STRICT_FLOWS] Undefined flow: ${_flow_name}`);
                } else {
                    _operation.id = genUUID();

                    return {
                        ..._payload,
                        flows: {
                            ..._payload.flows,
                            [_flow_name]: {
                                ...(_payload.flows[_flow_name] ?? {}),
                                [_operation.id]: _operation
                            }
                        }
                    }
                }
            })
        },
        moveOperation: (_flow_name, _operation, _direction) => {
            update(_payload => {
                console.log(_flow_name);
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
        removeFlow: (_flow_name) => {
            update(_payload => {
                delete _payload.flows[_flow_name];
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

export const PAYLOAD = createPayload();