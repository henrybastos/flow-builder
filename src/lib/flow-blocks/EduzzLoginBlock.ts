import type { EnvPayload, Payload } from "$lib/types"

const ENV_PAYLOAD: EnvPayload = {
	login_email: {
		schema: {
			label: 'E-mail',
			tooltip: 'O email utilizado para entrar na Eduzz',
			placeholder: 'fulano@email.com.br',
			type: 'text'
		},
		value: ''
	},
	login_password: {
		schema: {
			label: 'Senha',
			tooltip: 'A senha utilizada para entrar na Eduzz',
			placeholder: '********',
			type: 'password'
		},
		value: ''
	}
}

const PAYLOAD: Payload = {
   env: {
      login_email: '',
      login_password: ''
   },
   flows: {
      main_flow: [
         {
            command: "goto",
            enabled: true,
            target: "https://orbita.eduzz.com/producer/campaigns"
         },
         {
            command: "type",
            enabled: true,
            target: "//*/input[@type='email']",
            value: "%login_email%"
         },
         {
            command: "type",
            enabled: true,
            target: "//*/input[@type='password']",
            value: "%login_password%"
         },
         {
            command: "user_click",
            enabled: true,
            target: "//*/button[@id='signin']"
         }
      ]
   },
   config: {
      ws_endpoint: "",
      close_browser_on_finish: false,
      close_browser_on_cancel_request: false
   }
}

export const EduzzLoginBlock = {
   title: 'Eduzz - Login',
   block_id: '5817351e-5c56-4059-a620-759145d938a5',
   description: 'Faz login na Eduzz',
   payload: PAYLOAD,
   env_payload: ENV_PAYLOAD
}