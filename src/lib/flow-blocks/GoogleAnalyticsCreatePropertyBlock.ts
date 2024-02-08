import type { EnvPayloadModel, Payload } from "$lib/types";

const ENV_PAYLOAD: EnvPayloadModel = {
   "email": {
      "value": "",
      "schema": {
         "label": "Email",
         "tooltip": "Email tooltip",
         "placeholder": "Email placeholder",
         "type": "text"
      }
   },
   "password": {
      "value": "",
      "schema": {
         "label": "Password",
         "tooltip": "Password tooltip",
         "placeholder": "Password placeholder",
         "type": "text"
      }
   },
   "prop_name": {
      "value": "",
      "schema": {
         "label": "Prop_name",
         "tooltip": "Prop_name tooltip",
         "placeholder": "Prop_name placeholder",
         "type": "text"
      }
   },
   "category": {
      "value": "",
      "schema": {
         "label": "Category",
         "tooltip": "Category tooltip",
         "placeholder": "Selecione uma categoria",
         "fields_type": "select",
         "options": [
            "Artes e entretenimento",
            "Automóveis e veículos",
            "Beleza e fitness",
            "Livros e literatura",
            "Comércio e indústria",
            "Computadores e eletrônicos",
            "Finanças",
            "Comidas e bebidas",
            "Jogos",
            "Saúde",
            "Casa e jardim",
            "Internet e telecomunicações",
            "Empregos e educação",
            "Lei e governo",
            "Notícias",
            "Comunidades on-line",
            "Pessoas e sociedade",
            "Animais de estimação e animais",
            "Serviços imobiliários",
            "Referência",
            "Ciência",
            "Compras",
            "Esportes",
            "Viagens",
            "Outras atividades comerciais"
         ]
      }
   },
   "brand_url": {
      "value": "",
      "schema": {
         "label": "Brand_url",
         "tooltip": "Brand_url tooltip",
         "placeholder": "Brand_url placeholder",
         "type": "text"
      }
   }
};

const PAYLOAD: Payload = {
   "env": {
      "email": "kebook.programacao.2@gmail.com",
      "password": "4mYR51pz!",
      "prop_name": "otonsafraide.kebook.com.br/cursos/curso-completo-de-tatuagem-metodo-davinci",
      "category": {
         "value": "Empregos e educação",
         "__options__": [
            "Artes e entretenimento",
            "Automóveis e veículos",
            "Beleza e fitness",
            "Livros e literatura",
            "Comércio e indústria",
            "Computadores e eletrônicos",
            "Finanças",
            "Comidas e bebidas",
            "Jogos",
            "Saúde",
            "Casa e jardim",
            "Internet e telecomunicações",
            "Empregos e educação",
            "Lei e governo",
            "Notícias",
            "Comunidades on-line",
            "Pessoas e sociedade",
            "Animais de estimação e animais",
            "Serviços imobiliários",
            "Referência",
            "Ciência",
            "Compras",
            "Esportes",
            "Viagens",
            "Outras atividades comerciais"
         ]
      },
      "brand_url": "otonsafraide.kebook.com.br/cursos/curso-completo-de-tatuagem-metodo-davinci"
   },
   "flows": {
      "main_flow": [
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "login"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "navigate_admin"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "create_property"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "4000"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "commercial_details"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "4000"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "business_objectives"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "4000"
         },
         {
            "command": "run_flow",
            "enabled": true,
            "flow": "data_collection"
         }
      ],
      "login": [
         {
            "command": "goto",
            "enabled": true,
            "target": "https://analytics.google.com/analytics/web"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@type='email']",
            "value": "%email%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/span[text()='Next']"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "4000"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@type='password']",
            "value": "%password%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/span[text()='Next']"
         },
         {
            "command": "wait_for_navigation",
            "enabled": true
         }
      ],
      "create_property": [
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@id='name']",
            "value": "%prop_name%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/button[@debug-id=\"menu-open-button\"])[1]"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@debug-id=\"search-input\"]",
            "value": "Brasil"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[contains(@class, 'option-item-wrapper') and not(contains(@class, 'option-filtered'))]//button[@debug-id=\"option-item\"]"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/button[@debug-id=\"menu-open-button\"])[2]"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@debug-id=\"search-input\"]",
            "value": "São Paulo"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[contains(@class, 'option-item-wrapper') and not(contains(@class, 'option-filtered'))]//button[@debug-id=\"option-item\"]"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/button[@debug-id=\"menu-open-button\"])[3]"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@debug-id=\"search-input\"]",
            "value": "Real"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[contains(@class, 'option-item-wrapper') and not(contains(@class, 'option-filtered'))]//button[@debug-id=\"option-item\"]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/button//*[text()='Próxima'])[1]"
         }
      ],
      "navigate_admin": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/a//span[text()='Administrador']"
         },
         {
            "command": "wait_for_navigation",
            "enabled": true
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@aria-haspopup=\"menu\"]//span[contains(text(), 'Criar')]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@role=\"menuitem\"]//*[text()='Propriedade']"
         },
         {
            "command": "wait_for_navigation",
            "enabled": true
         }
      ],
      "commercial_details": [
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/button[@debug-id=\"menu-open-button\"])[4]"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@debug-id=\"search-input\"]",
            "value": "%category.value%"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "2000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/div[contains(@class, 'option-item-wrapper') and not(contains(@class, 'option-filtered'))]//button[@debug-id=\"option-item\"]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/input[@type='radio'])[1]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/button//*[text()='Próxima'])[2]"
         }
      ],
      "business_objectives": [
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/input[@type=\"checkbox\"])[1]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/input[@type=\"checkbox\"])[2]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/input[@type=\"checkbox\"])[3]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "(//*/input[@type=\"checkbox\"])[4]"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button//span[text()='Criar']"
         }
      ],
      "data_collection": [
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@debug-id=\"create-web-stream-button\"]"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@debug-id=\"website-url-input\"]",
            "value": "%brand_url%"
         },
         {
            "command": "type",
            "enabled": true,
            "target": "//*/input[@debug-id=\"stream-name-input\"]",
            "value": "https://%brand_url%"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/button[@debug-id=\"create-stream-button\"]"
         },
         {
            "command": "wait_seconds",
            "enabled": true,
            "time": "10000"
         },
         {
            "command": "click",
            "enabled": true,
            "target": "//*/i[@aria-label=\"Fechar tela\"]"
         },
         {
            "command": "scrape_attr",
            "enabled": true,
            "target": "//*/div[@guidedhelpid=\"measurement-id\"]/span",
            "attr": "innerText",
            "response_slot": "metrics_id"
         }
      ],
      "gtag-eval": [
         {
            "command": "eval_expression",
            "enabled": true,
            "expression": "console.log('GTAG', x('//*/div[@data-ng-if=\"ctrl.snippet\"]').innerText.match(/G-[A-z,0-9]*/gi))"
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

export const GoogleAnalyticsCreatePropertyBlock = {
    title: 'Google Analytics - Create Property',
    block_id: 'ccf422e6-21dc-42e9-93d8-1b4354f48180',
    description: 'Creates a Google Analytics property.',
    payload: PAYLOAD,
    env_payload: ENV_PAYLOAD
}