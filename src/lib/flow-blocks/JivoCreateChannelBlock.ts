import type { EnvPayloadModel, Payload } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = {
   "jivo_email": {
      "value": "",
      "schema": {
         "label": "E-mail de login",
         "tooltip": "E-mail para login no Jivo",
         "placeholder": "usuario@email.com",
         "type": "text"
      }
   },
   "jivo_password": {
      "value": "",
      "schema": {
         "label": "Senha de login",
         "tooltip": "Senha para login no Jivo",
         "placeholder": "********",
         "type": "text"
      }
   },
   "jivo_url": {
      "value": "",
      "schema": {
         "label": "Nome do canal",
         "placeholder": "nomesobrenome.kebook.com.br",
         "type": "text"
      }
   },
   "jivo_color": {
      "value": "",
      "schema": {
         "label": "Cor do Jivo",
         "tooltip": "Cor do widget do JivoChat (em hexadecimal)",
         "placeholder": "#FF00FF",
         "type": "text"
      }
   },
   "jivo_theme": {
      "value": "auto",
      "schema": {
         "label": "Tema do Jivo",
         "tooltip": "Determina a cor de contraste do chat",
         "placeholder": "Automático",
         "fields_type": "select",
         "options": [
            {
               "label": "Escuro",
               "value": "dark"
            },
            {
               "label": "Claro",
               "value": "light"
            },
            {
               "label": "Automático",
               "value": "auto"
            }
         ]
      }
   }
};

const PAYLOAD: Payload = {
   "env": {
      "jivo_email": "kebook.programacao.2@gmail.com",
      "jivo_password": "Kbk@1234",
      "jivo_url": "https://bernardofernandes.kebook.com.br/cursos/sabao-caseiro-lucrativo",
      "jivo_color": "#51aafd",
      "jivo_theme": {
         "value": "auto",
         "__options__": [
            {
               "label": "Escuro",
               "value": "dark"
            },
            {
               "label": "Claro",
               "value": "light"
            },
            {
               "label": "Automático",
               "value": "auto"
            }
         ]
      }
   },
   "flows": {
      "main_flow": [
         {
            "command": "goto",
            "enabled": true,
            "target": "https://app.jivosite.com/settings/channels?lang=pt"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@type='email']",
            "value": "%jivo_email%"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@type='password']",
            "value": "%jivo_password%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[text()='Entrar']"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[contains(@placeholder,'Busque')]",
            "value": "%jivo_url%"
         },
         {
            "command": "check_element",
            "enabled": true,
            "target": "//*[text()='%jivo_url%']",
            "success_flow": "select_brand_flow",
            "error_flow": "create_brand_flow"
         }
      ],
      "select_brand_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[contains(text(), '%jivo_url%')]"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "instalation_flow"
         },
         {
            "command": "set_payload_slot",
            "enabled": true,
            "response_slot": "operation_status",
            "value": "Jivo already existed. Instalation code extracted."
         }
      ],
      "create_brand_flow": [
         {
            "command": "reload",
            "enabled": true
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/h3[text()='Chat online']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[text()='Adicionar site']"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@name='channelNameInput']",
            "value": "%jivo_url%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/span[text()='Portuguese']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/li[@title='Brazilian Portuguese']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[text()='Adicionar site']"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "config_brand_flow"
         },
         {
            "command": "set_payload_slot",
            "enabled": true,
            "response_slot": "operation_status",
            "value": "New jivo created!"
         }
      ],
      "config_brand_flow": [
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "preferences_flow"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "instalation_flow"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "service_quality_flow"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "pre_chat_flow"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "automatic_activities_flow"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "contact_form_flow"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "design_flow"
         }
      ],
      "preferences_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[text()='Preferências']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/h2[text()='Esconder o logotipo do JivoChat']/parent::div//input"
         }
      ],
      "instalation_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[text()='Instalação']"
         },
         {
            "command": "scrape_attr",
            "enabled": true,
            "target": "//*/textarea",
            "attr": "value",
            "response_slot": "jivo_id"
         }
      ],
      "service_quality_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[text()='Avaliação de qualidade do serviço']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/h2[text()='Habilitar serviço de avaliação de qualidade']/parent::div//input"
         }
      ],
      "pre_chat_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[text()='Botões pré-chat']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/h2[text()='Habilitar botões pré-chat']/parent::div//input"
         }
      ],
      "automatic_activities_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[text()='Atividades automáticas']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/h2[text()='A frase de espera']/parent::div//input"
         }
      ],
      "contact_form_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[text()='Formulário de contato']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/span[text()='Durante a conversa']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/li[@title='Desativar']"
         }
      ],
      "design_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[text()='Design']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*[contains(text(),'Canto inferior direito')])[1]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*[contains(text(),'Inferior esquerdo')])[1]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/p[text()='Cor do texto']/parent::*//div[contains(@class, 'switch')]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[@id='%jivo_theme%' and @data-qa-id='dropdown-option']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[contains(text(),'Color')]"
         },
         {
            "command": "chrome_picker_set_color",
            "enabled": true,
            "color": "%jivo_color%",
            "trigger_target": "(//*/div[contains(@class, 'colorPickerBtn')])[1]",
            "picker_target": "(//*[contains(@class,'chrome-picker')])[1]//input"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*[contains(@style,'background-color: rgb(68, 86, 105);')]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*[contains(text(),'Salvar configurações')]"
         }
      ]
   },
   "config": {
      "ws_endpoint": "",
      "close_browser_on_finish": false,
      "close_browser_on_cancel_request": false,
      "headless": true
   }
};

export const JivoCreateChannelBlock = {
    title: 'Jivo - Criar canal',
    block_id: '5647c62b-2201-41ea-93d9-39d64ec490be',
    description: 'Cria um JivoChat. Caso já tenha sido criado, somente extrai o código do chat.',
    payload: PAYLOAD,
    env_payload: ENV_PAYLOAD
}