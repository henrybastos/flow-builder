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
   description?: string
   value?: string
   name?: string
   flow?: string
   time?: string
   color?: string
   trigger_target?: string
   picker_target?: string
   success_flow?: string
   error_flow?: string
   regex?: string
   expression?: string
   attr?: string
   response_slot?: string
   env_var?: string
   input_fields?: InputFields
   page_id?: string
   key?: string
   trigger_onchange_on_tab?: boolean
   filename?: string
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
   fields_type: 'array' | 'object' | 'select'
   options?: Array<string | { label: string, value: string }>
   fields?: {
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

export type InputType = 'text' | 'password' | 'email';

export interface BlockProps {
   title: string
   block_id: string
   description: string
   dependencies?: Array<string>
   tags: Array<string>
   payload: Payload
   env_payload: EnvPayloadModel
}