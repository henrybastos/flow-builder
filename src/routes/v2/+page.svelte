<script>
   import { toast } from 'svelte-sonner';
   import * as Card from '$lib/components/ui/card';
   
   import Draggy from '$lib/components/draggy/Draggy.svelte';
   import DraggyItem from '$lib/components/draggy/DraggyItem.svelte';
   import DraggyPlaceholder from '$lib/components/draggy/DraggyPlaceholder.svelte';
   import DraggyVoid from "$lib/components/draggy/DraggyVoid.svelte";
   import Button from '$lib/components/ui/button/button.svelte';
    import FlowDropdown from './FlowDropdown.svelte';

   let PAYLOAD = {
      "env": {
         "_$fb": {
            "pages": {
               "main_page": "main_page"
            }
         },
         "account_name": "alefysousa.kebook.com.br/cursos/escola-de-acougueiros"
      },
      "flows": {
         "main_flow": [
            {
               "command": "run_flow",
               "enabled": true,
               "flow": "login"
            },
            {
               "command": "goto",
               "enabled": true,
               "target": "https://tagmanager.google.com/#/home"
            },
            {
               "command": "wait_for_dom_render",
               "enabled": true,
               "time": ""
            },
            {
               "command": "eval_expression",
               "enabled": true,
               "expression": "env({ account: `//span[@class=\"account-list-header__account-name wd-account-name\" and contains(text(), \"@@account_name@\")]` })"
            }
         ],
         "login": [
            {
               "command": "goto",
               "enabled": true,
               "target": "https://accounts.google.com/ServiceLogin?hl=en-US&theme=mn&passive=true&continue=https://www.google.com/&ec=GAZAmgQ"
            },
            {
               "command": "eval_expression",
               "enabled": false,
               "expression": "env({ '@private:new_url': `${ window.location.href.replace('glif', 'mn') }&hl=en-US` })"
            },
            {
               "command": "goto",
               "enabled": false,
               "target": "@@new_url@"
            },
            {
               "command": "screenshot",
               "enabled": true,
               "filename": "google_login_001.png"
            },
            {
               "command": "keyboard_type",
               "enabled": true,
               "target": "//*/input[@type='email']",
               "value": "@@email@"
            },
            {
               "command": "click",
               "enabled": true,
               "target": "//*/div//*[text()='Next']"
            },
            {
               "command": "branch_eval",
               "enabled": true,
               "expression": "wait_for_element(90, `//input[@name=\"Passwd\"]`)",
               "success_flow": "captcha_pass",
               "error_flow": "auth_error"
            }
         ],
         "captcha_pass": [
            {
               "command": "keyboard_type",
               "enabled": true,
               "target": "//*/input[@type='password']",
               "value": "@@password@"
            },
            {
               "command": "click",
               "enabled": true,
               "target": "//*/div//*[text()='Next']"
            },
            {
               "command": "wait_seconds",
               "enabled": true,
               "time": "5000"
            },
            {
               "command": "branch_eval",
               "enabled": true,
               "expression": "async_eval(6, 1000, res => {const verifyBtn = x('//*[contains(text(), \"Use another phone or\")]');if (!verifyBtn) {res('Verificação OK!');} else {verifyBtn.click();return { error: 'Verifique sua conta do Google no link https://g.co/verifyaccount e depois execute o bloco novamente.' }}})",
               "success_flow": "",
               "error_flow": "auth_needed"
            }
         ],
         "auth_needed": [
            {
               "command": "eval_expression",
               "enabled": true,
               "expression": "env({ erro: 'Verifique sua conta do Google no link https://g.co/verifyaccount e em seguida execute o bloco novamente.' })"
            },
            {
               "command": "close_browser",
               "enabled": true
            }
         ],
         "auth_error": [
            {
               "command": "eval_expression",
               "enabled": true,
               "expression": "env({ auth_error: 'Erro ao autenticar o login no Google.' })"
            }
         ]
      },
      "config": {
         "ws_endpoint": "",
         "close_browser_on_finish": false,
         "close_browser_on_cancel_request": false,
         "headless": false
      }
   };
</script>

<main class="flex flex-col w-screen overflow-hidden">
   {#if PAYLOAD}    
      <Draggy class="flex flex-row p-6 justify-center" let:list bind:list={PAYLOAD.flows}>
         <Card.Root class="w-[60rem] h-min">
            <Card.Header class="flex flex-row justify-between items-center">
               <Card.Title class="text-3xl">Flow Builder</Card.Title>
               <Button variant="ghost" size="icon">
                  <i class="ti ti-dots-vertical"></i>
               </Button>
            </Card.Header>
   
            <Card.Content class="flex flex-col w-full space-y-6 justify-center">
               {#each list as flow}
                  <Card.Root class="w-full h-min">
                     <Card.Header class="flex flex-row justify-between items-center">
                        <Card.Title class="text-2xl">{ flow.context_id }</Card.Title>

                        <FlowDropdown />
                     </Card.Header>
            
                     <Card.Content class="space-y-3">
                        {#each flow.list as operation}    
                           <DraggyItem item={operation}>
                                 <div class="flex flex-row p-3 border-2 border-neutral-700 rounded-md">
                                    <i data-draggy-grab class="ti ti-menu-2 mr-3 cursor-grab"></i>
                                    <h6>{ operation.data.command }</h6>
                                 </div>
                           </DraggyItem>
                        {:else}
                           <DraggyVoid contextID={flow.context_id}>
                              <h6 class="m-2">No operations</h6>
                           </DraggyVoid>
                        {/each}
                     </Card.Content>
                     
                     <Card.Footer>
                        <p class="text-neutral-600 w-full text-center">{ flow.list.length } operations</p>
                     </Card.Footer>
                  </Card.Root>
               {/each}
            </Card.Content>
            
            <Card.Footer>
               <p class="text-neutral-600 w-full text-center">Footer</p>
            </Card.Footer>
         </Card.Root>
   
         <DraggyPlaceholder offset={{ x: -25 }}>
               <div class="flex flex-row p-3 w-[30rem] border-2 border-neutral-700 rounded-lg">
                  <i data-draggy-grab class="ti ti-menu-2 mr-3 cursor-grab"></i>
                  <h6>Operation</h6>
               </div>
         </DraggyPlaceholder>
      </Draggy>
   
      <pre class="p-6 w-[40rem]">{ JSON.stringify(PAYLOAD.flows, null, 3) }</pre>
      <pre class="p-6 w-[40rem]">{ JSON.stringify(PAYLOAD.flows, null, 3) }</pre>
      <pre class="p-6 w-[40rem]">{ JSON.stringify(PAYLOAD.flows, null, 3) }</pre>
   {/if}
</main>