import type { EnvPayloadModel, Payload } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = {
   product_id: {
      value: '',
      schema: {
         label: 'ID do produto',
         placeholder: '2143359',
         tooltip: 'O ID do produto.',
         type: 'text'
      }
   },
   coupons: {
      template_schema: {
         name: '',
         description: '',
         discount: '',
         year: '',
         day: '',
         month: ''
      },
      schema: {
         label: 'Cupons',
         tooltip: 'Cupons à serem criados.',
         fields_type: 'array',
         fields: {
            name: {
               label: 'Código do cupom',
               tooltip: 'Ex.: CARNAVAL40',
               placeholder: 'CARNAVAL40',
               type: 'text'
            },
            description: {
               label: 'Descrição do cupom',
               tooltip: 'Ex.: Cupom de 40% de desconto.',
               placeholder: 'Cupom de 40% de desconto.',
               type: 'text'
            },
            discount: {
               label: 'Valor do desconto',
               tooltip: 'Ex.: 40',
               placeholder: '40',
               type: 'number'
            },
            year: {
               label: 'Ano limite',
               tooltip: 'Data limite que o cupom ainda será válido.',
               placeholder: '2024',
               type: 'text'
            },
            day: {
               label: 'Dia limite',
               tooltip: 'Data limite que o cupom ainda será válido.',
               placeholder: '01',
               type: 'text'
            },
            month: {
               label: 'Mês limite',
               tooltip: 'Data limite que o cupom ainda será válido.',
               placeholder: '02',
               type: 'text'
            }
         }
      },
      value: [
         {
            "name": "UPSELL25",
            "description": "Coupon 25%",
            "discount": 25,
            "year": "2025",
            "day": "01",
            "month": "01"
         },
         {
            "name": "ANONOVO40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "02"
         },
         {
            "name": "CARNAVAL40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "02"
         },
         {
            "name": "MULHER35",
            "description": "Coupon 35%",
            "discount": 35,
            "year": "2024",
            "day": "09",
            "month": "04"
         },
         {
            "name": "PASCOA40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "05",
            "month": "04"
         },
         {
            "name": "MAES40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "06"
         },
         {
            "name": "AMOR40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "07"
         },
         {
            "name": "INVERNO35",
            "description": "Coupon 35%",
            "discount": 35,
            "year": "2024",
            "day": "01",
            "month": "08"
         },
         {
            "name": "PAIS45",
            "description": "Coupon 45%",
            "discount": 45,
            "year": "2024",
            "day": "01",
            "month": "09"
         },
         {
            "name": "PRIMAVERA45",
            "description": "Coupon 45%",
            "discount": 45,
            "year": "2024",
            "day": "01",
            "month": "10"
         },
         {
            "name": "HALLOWEEN40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "11"
         },
         {
            "name": "BLACK55",
            "description": "Coupon 55%",
            "discount": 55,
            "year": "2024",
            "day": "01",
            "month": "12"
         },
         {
            "name": "NATAL50",
            "description": "Coupon 50%",
            "discount": 50,
            "year": "2024",
            "day": "01",
            "month": "01"
         }
      ]
   }
}

const PAYLOAD: Payload = {
   "env": {
      "coupons": [
         {
            "name": "UPSELL25",
            "description": "Coupon 25%",
            "discount": 25,
            "year": "2025",
            "day": "01",
            "month": "01"
         },
         {
            "name": "ANONOVO40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "02"
         },
         {
            "name": "CARNAVAL40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "02"
         },
         {
            "name": "MULHER35",
            "description": "Coupon 35%",
            "discount": 35,
            "year": "2024",
            "day": "09",
            "month": "04"
         },
         {
            "name": "PASCOA40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "05",
            "month": "04"
         },
         {
            "name": "MAES40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "06"
         },
         {
            "name": "AMOR40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "07"
         },
         {
            "name": "INVERNO35",
            "description": "Coupon 35%",
            "discount": 35,
            "year": "2024",
            "day": "01",
            "month": "08"
         },
         {
            "name": "PAIS45",
            "description": "Coupon 45%",
            "discount": 45,
            "year": "2024",
            "day": "01",
            "month": "09"
         },
         {
            "name": "PRIMAVERA45",
            "description": "Coupon 45%",
            "discount": 45,
            "year": "2024",
            "day": "01",
            "month": "10"
         },
         {
            "name": "HALLOWEEN40",
            "description": "Coupon 40%",
            "discount": 40,
            "year": "2024",
            "day": "01",
            "month": "11"
         },
         {
            "name": "BLACK55",
            "description": "Coupon 55%",
            "discount": 55,
            "year": "2024",
            "day": "01",
            "month": "12"
         },
         {
            "name": "NATAL50",
            "description": "Coupon 50%",
            "discount": 50,
            "year": "2024",
            "day": "01",
            "month": "01"
         }
      ],
      "product_id": "2143359"
   },
   "flows": {
      "main_flow": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/*[text()='Criar cupom']"
         },
         {
            "command": "run_flow_for_each",
            "enabled": true,
            "flow": "create_coupon",
            "env_var": "%coupons%"
         }
      ],
      "create_coupon": [
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@placeholder='Ex.: EDZ-0001']",
            "value": "%name%"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@maxlength=\"16\"]",
            "value": "%discount%00"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/textarea[@placeholder='Ex.: Cupom promocional']",
            "value": "%description%"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "set_expiration_date"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/*[text()='Próximo']"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "1000"
         },
         {
            "command": "user_click",
            "enabled": true,
            "target": "//*/td[text()='%$$env.product_id%']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/*[text()='Próximo']"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "1000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[@class=\"ant-modal-confirm-btns\"]//button/span[text()='OK']"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "1000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/span[text()='Adicionar novo cupom']"
         }
      ],
      "set_expiration_date": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@id='has_expiration_date']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/input[@id='limited_date']"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@class=\"ant-picker-year-btn\"]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/td[@title=\"%year%\"]"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "1000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@class=\"ant-picker-month-btn\"]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/td[@title=\"%year%-%month%\"]"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "1000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/td[@title=\"%year%-%month%-%day%\"]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/ul[@class=\"ant-picker-time-panel-column\"])[1]/li[1]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/ul[@class=\"ant-picker-time-panel-column\"])[2]/li[1]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button/span[text()='OK']"
         }
      ]
   },
   config: {
      ws_endpoint: "",
      close_browser_on_finish: false,
      close_browser_on_cancel_request: false,
      headless: true
   }
}

export const EduzzCreateMultipleCouponsBlock = {
   title: 'Eduzz - Create Multiple Coupons',
   block_id: '4df6ee4c-f5be-4a65-ba86-3944e670ca2b',
   description: 'Cria cupons na Eduzz.',
   payload:PAYLOAD,
   env_payload: ENV_PAYLOAD
}