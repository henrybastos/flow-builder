import type { EnvPayloadModel, Payload } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = {
   course_home: {
      value: '',
      schema: {
         label: 'Course home URL',
         tooltip: 'Prop 1 tooltip',
         placeholder: 'Prop 1 placeholder',
         type: 'text'
      }
   },
   modules: {
      template_schema: { module_title: '', module_lessons: [] },
      schema: {
         label: 'Módulos',
         tooltip: 'My tooltip',
         fields_type: 'array',
         fields: {
            module_title: {
               label: 'Módulo 01',
               tooltip: 'Prop 1 tooltip',
               placeholder: 'Prop 1 placeholder',
               type: 'text'
            },
            module_lessons: {
               template_schema: { lesson_title: '', lesson_link: '' },
               schema: {
                  label: 'Aulas',
                  tooltip: 'My tooltip',
                  fields_type: 'array',
                  fields: {
                     lesson_title: {
                        label: 'Título da Aula',
                        tooltip: 'Prop 1 tooltip',
                        placeholder: 'Prop 1 placeholder',
                        type: 'text'
                     },
                     lesson_link: {
                        label: 'Link da Aula',
                        tooltip: 'Prop 1 tooltip',
                        placeholder: 'Prop 1 placeholder',
                        type: 'text'
                     }
                  }
               },
               value: []
            }
         }
      },
      value: []
   }
}

const PAYLOAD: Payload = {
   "env": {
      "course_home": "https://my.nutror.com/cursos/274841/editar/modulos",
      "modules": [
         {
            "module_title": "Módulo 1 - MOD 1",
            "module_lessons": [
               {
                  "lesson_title": "Aula 01",
                  "lesson_link": "https://www.youtube.com/watch?v=05Xl9ze-5-s"
               },
               {
                  "lesson_title": "Aula 02",
                  "lesson_link": "https://www.youtube.com/watch?v=LleeqCYYv80"
               }
            ]
         },
         {
            "module_title": "Módulo 2 - MOD 02",
            "module_lessons": [
               {
                  "lesson_title": "Aula 01",
                  "lesson_link": "https://www.youtube.com/watch?v=4ps-bDRZ6II"
               }
            ]
         }
      ]
   },
   "flows": {
      "main_flow": [
         {
            "command": "run_flow_for_each",
            "enabled": true,
            "flow": "create_module",
            "env_var": "%modules%"
         }
      ],
      "create_module": [
         {
            "command": "goto",
            "enabled": true,
            "target": "%$$env.course_home%"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/span[text()='Adicionar módulos']"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@id='module_title']",
            "value": "%module_title%"
         },
         {
            "command": "type",
            "enabled": false,
            "target": "//*/input[@id='module_days_locked']",
            "value": "%module_days_locked%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@id='module_save']"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "3000"
         },
         {
            "command": "user_click",
            "enabled": true,
            "target": "//*/h6[text()='%module_title%']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/button/span[text()='Adicionar Aula'])[last()]"
         },
         {
            "command": "extract_route_from_url",
            "enabled": true,
            "regex": "(?<=/cursos/[0-9]*/editar/modulos/).*(?=/aula)",
            "response_slot": "module_id"
         },
         {
            "command": "run_flow_for_each",
            "enabled": true,
            "flow": "create_lesson",
            "env_var": "%module_lessons%"
         }
      ],
      "create_lesson": [
         {
            "command": "goto",
            "enabled": true,
            "target": "%$$env.course_home%/%$$res.module_id%/aula"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/label[text()='Titulo']/following-sibling::div/input",
            "value": "%lesson_title%"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/label[text()='Descrição (Nutror Experience)']/following-sibling::div/textarea",
            "value": "%lesson_title%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/h6[text()='Conteúdos']/following-sibling::ul//*[text()='Youtube / Vimeo']"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/label[text()='Url']/following-sibling::div/input",
            "value": "%lesson_link%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/p[text()='Ativar DRM']/parent::span/preceding-sibling::span//input"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button//*[text()='Salvar']"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         }
      ]
   },
   "config": {
      "ws_endpoint": "",
      "close_browser_on_finish": false,
      "close_browser_on_cancel_request": false
   }
}

export const TestBlock = {
   title: 'Test Block',
   block_id: '4df6ee4c-f5be-4a65-ba86-3944e670ca2b',
   description: 'Testa o env',
   payload: PAYLOAD,
   env_payload: ENV_PAYLOAD
}