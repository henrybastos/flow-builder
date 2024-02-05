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
    flow?: string
    time?: string
    regex?: string
    response_slot?: string
    env_var?: string
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

export interface EnvProps {
    schema: EnvSchema,
    template_schema?: object | string,
    value?: string | Array<string | number | object>
}

export interface EnvPayload {
    [key: string]: EnvProps
}

export interface EnvSchema {
    label?: string
    tooltip?: string
    placeholder?: string
    type?: InputType
    fields_type?: 'object' | 'array'
    fields?: {
        [key: string]: EnvProps | EnvSchema
    }
}

export interface EnvFieldSchema {
    label?: string
    tooltip?: string
    placeholder: string
    type: InputType
}

export type InputType = 'text' | 'password' | 'email';