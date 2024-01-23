export interface PayloadConfig {
    ws_endpoint: boolean
    close_browser_on_finish: boolean
    close_browser_on_cancel_request: boolean
}

export interface Operation {
    command: string
    enabled: boolean
    target?: string
    value: string
    input_fields?: InputFields
}

export interface InputFields {
    type: 'dropdown' | 'text',
    label: string,
    value: string | number
    options?: [],
}

export type Flow = Array<Operation>;

export interface Payload {
    flows: Flow,
    config: PayloadConfig,
    env: Object
}