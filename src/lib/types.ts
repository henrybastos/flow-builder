export interface PayloadConfig {
    ws_endpoint: string
    close_browser_on_finish: boolean
    close_browser_on_cancel_request: boolean
    headless: boolean
}

export interface Operation {
    command: string
    enabled: boolean
    target?: string
    value?: string
    flow?: string
    time?: string
    regex?: string
    expression?: string
    attr?: string
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

export interface InputFieldSchema {
    label?: string
    tooltip?: string
    placeholder: string
    type: InputType
}

export interface FieldSchema {
    label: string
    tooltip?: string
    fields_type: 'array' | 'object'
    fields: {
        [key: string]: EnvPayloadSchema | InputFieldSchema
    }
}

export interface EnvPayloadSchema {
    value?: string | Array<string | object>
    template_schema?: object
    schema?: InputFieldSchema | FieldSchema
}

export interface EnvPayloadModel {
    [key: string]: EnvPayloadSchema
}

export type InputType = 'text' | 'password' | 'email' | 'number';