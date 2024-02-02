export interface PayloadConfig {
    ws_endpoint: string
    close_browser_on_finish: boolean
    close_browser_on_cancel_request: boolean
}

export interface Operation {
    command: string
    enabled: boolean
    target?: string
    value?: string
    input_fields?: InputFields
}

export interface InputFields {
    type: 'dropdown' | 'text'
    label: string
    value: string | number
    options?: []
}

export type Flow = Array<Operation>;

export interface Payload {
    flows: {
        [key: string]: Flow
    }
    config: PayloadConfig,
    env: Object
}

export interface EnvPayload {
    [key: string]: {
        schema: EnvSchema
        value?: string | ''
        values?: string[] | { 
            [key: string]: string
        }
    }
}

export interface EnvSchema {
    label?: string
    tooltip?: string
    placeholder?: string
    type?: string
    groupType?: 'object' | 'array'
    fields?: {
        [key: string]: EnvSchema
    }
}