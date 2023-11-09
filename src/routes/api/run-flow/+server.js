// import puppeteer from "puppeteer";
// import { checkForEnvPlaceholder, trimEnvPlaceholder, replaceEnvPlaceholder } from "$lib/utils.js";

// //*/div[contains(text(), 'https://alessandrobechelin.kebook.com.br')]

/** 
 * @typedef {Object} Flow
 * @property {'goto'|'type'|'press_key'|'click'|'scrape_value'|'check_element'|'reload'|'run_flow'|'eval_regex'} command
 * @property {string} target
 * @property {string} value
 * @property {string} regex
 * @property {string} payload_slot - A slot to store data to the payload
 * @property {string} success_flow - The flow to execute in case of a success.
 * @property {string} error_flow - The flow to execute in case of an error.
 */

// const logCommands = false;

// const ENV_VARIABLES_ALLOWLIST = [
//     'target',
//     'trigger_target',
//     'picker_target',
//     'color',
//     'key',
//     'mod_keys',
//     'keys',
//     'response_slot',
//     'time',
//     'value'
// ]

export async function POST ({ request }) {
    const payload = await request.json();
    
    let response = await fetch('http://localhost:5001/run-flow', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic k3b00k#vip@dev'
        },
        body: JSON.stringify( payload )
    });

    return new Response(JSON.stringify( response ));

    // const [page, browser] = await _startEngine();

    // let responsePayload = {};

    // async function _startEngine () {
    //     const browser = await puppeteer.launch({
    //         headless: false,
    //     });

        
    //     const [page] = await browser.pages();

    //     page.on('dialog', async (dialog) => {
    //         await dialog.accept();
    //     });

    //     return [page, browser];
    // }

    // function _checkEnvVars (_env, _field_name, _field_value) {
    //     if (ENV_VARIABLES_ALLOWLIST.includes(_field_name) && checkForEnvPlaceholder(_field_value)) {
    //         return replaceEnvPlaceholder(_field_value, _env);
    //     }

    //     return _field_value;
    // }

    // async function _getElement (_target) {
    //     if (payload?.wait_timeout) {
    //         await page.waitForSelector(`xpath/${ _target }`, {
    //             timeout: payload.wait_timeout
    //         });
    //     } else {
    //         await page.waitForSelector(`xpath/${ _target }`);
    //     }
    //     return await page.$$(`xpath/${ _target }`);
    // }

    // async function _clickElement ({ target, count = 1 }, _click_type = 'machine') {
    //     for (let i = count; i > 0; i--) {
    //         const [_element] = await _getElement(target);
            
    //         if (_click_type === 'user') {
    //             await _element.click();
    //         } else {
    //             await _element.evaluate(el => el.click());
    //         }
    //     }
    // }

    // async function _typeElement ({ target, value }) {
    //     const [_element] = await _getElement(target);
    //     await _element.type(value);
    // }

    // async function _selectInputValue ({ target }) {
    //     const [_element] = await _getElement(target);
    //     return await _element.evaluate(el => el.select());
    // }

    // async function _scrapeAttribute ({ target, attr }) {
    //     const [_element] = await _getElement(target);
    //     return await _element.evaluate((el, _attr) => el[_attr], attr);
    // }

    // async function _scrapeMultipleAttributes ({ target, attr }) {
    //     let _returnObj = [];
    //     const _elements = await _getElement(target);

    //     for (const _el of _elements) {
    //         _returnObj.push(await _el.evaluate((el, _attr) => el[_attr], attr));
    //     }
    //     return _returnObj;
    // }

    // async function _setAttribute ({ target, attr, value }) {
    //     const [_element] = await _getElement(target);
    //     return await _element.evaluate((el, _attr, _value) => el[_attr] = _value, attr, value);
    // }

    // async function _evaluateRegex ({ target, regex }) {
    //     const [_element] = await _getElement(target);
    //     return await _element.evaluate((el, _regex) => el.value.match(new RegExp(_regex, 'g')), regex);
    //     // return await _element.evaluate((el) => el.value.match(/(?<=widget).+/g)[0].slice(1,-1));
    // }

    // async function _checkElement ({ target, success_flow, error_flow }) {
    //     try {
    //         await _getElement(target);
    //         return success_flow;
    //     } catch (err) {
    //         console.log(err);
    //         return error_flow;
    //     }
    // }

    // async function _runFlowForEach ({ env_var, flow }) {
    //     const envVar = trimEnvPlaceholder(env_var);
        
    //     for (const _env of payload.env[envVar]) {
    //         await runFlow(payload.flows[flow], _env);
    //     }
    // }

    // async function evalOperation (_operation, _env) {
    //     if (logCommands) {
    //         console.log(_operation);
    //     }

    //     for (const [_input_name, _input_value] of Object.entries(_operation)) {
    //         _operation[_input_name] = _checkEnvVars(_env, _input_name, _input_value);
    //     }

    //     switch (_operation.command) {
    //         case 'goto':    
    //             await page.goto(_operation.target, { waitUntil: 'networkidle0' });
    //             break;
    //         case 'reload':    
    //             await page.reload({ waitUntil: ['networkidle0', "domcontentloaded"] });
    //             break;
    //         case 'wait_navigation':    
    //             await page.waitForNavigation();
    //             break;
    //         case 'chrome_picker_set_color':    
    //             await _clickElement({ target: _operation.trigger_target });
    //             await _clickElement({ target: _operation.picker_target }, 'user');
    //             await _selectInputValue({ target: _operation.picker_target });
    //             await _typeElement({ target: _operation.picker_target, value: _operation.color });
    //             break;
    //         case 'click':
    //             await _clickElement(_operation);
    //             break;
    //         case 'user_click':    
    //             await _clickElement(_operation, 'user');
    //             break;
    //         case 'type':
    //             await _typeElement(_operation);
    //             break;
    //         case 'select':
    //             await _selectInputValue(_operation);
    //             break;
    //         case 'press_key':
    //             await page.keyboard.press(_operation.key);
    //             break;
    //         case 'combo_keys':
    //             for(const key of _operation.mod_keys) {
    //                 await page.keyboard.down(key);
    //             }

    //             for(const key of _operation.keys) {
    //                 await page.keyboard.press(key);
    //             }

    //             for(const key of _operation.mod_keys) {
    //                 await page.keyboard.up(key);
    //             }
    //             break;
    //         case 'scrape_attr':
    //             responsePayload[_operation.response_slot] = await _scrapeAttribute(_operation);
    //             break;
    //         case 'scrape_multiple_attr':
    //             responsePayload[_operation.response_slot] = await _scrapeMultipleAttributes(_operation);
    //             break;
    //         case 'set_attr':
    //             responsePayload[_operation.response_slot] = await _setAttribute(_operation);
    //             break;
    //         case 'check_element':
    //             await runFlow(payload.flows[await _checkElement(_operation)], payload.env);
    //             break;
    //         case 'run_flow':
    //             await runFlow(payload.flows[_operation.flow], payload.env);
    //             break;
    //         case 'run_flow_for_each':
    //             await _runFlowForEach(_operation)
    //             break;
    //         case 'eval_regex':
    //             responsePayload[_operation.response_slot] = await _evaluateRegex(_operation);
    //             break;
    //         case 'wait':
    //             await new Promise((res) => {
    //                 setTimeout(res, _operation.time);
    //             });
    //             break;
    //         case 'set_payload_slot':
    //             responsePayload[_operation.response_slot] = _operation.value;
    //             break;
    //         case 'close_browser':
    //             await browser.close();
    //             console.log('All done!');
    //             break;
    //     }
    // }

    // async function runFlow (_flow, _env) {
    //     for(const operation of _flow) {
    //         // Avoids replacement issues with repeatears like Run Flow For Each
    //         let operationCopy = structuredClone(operation);
    //         await evalOperation(operationCopy, _env);
    //     }
    // }

    // try {   
    //     // responsePayload.base_url = payload.base_url;
    //     await runFlow(payload.flows.main_flow, payload.env);
    //     // await browser.close();
    //     responsePayload.status = {
    //         message: 'All operations done.',
    //         code: 200
    //     };
    //     console.dir(responsePayload, { depth: null });
    //     return new Response(JSON.stringify( responsePayload ));
    // } catch (err) {
    //     console.log(err);
    //     return new Response(JSON.stringify({ 
    //         error: {
    //             raw: err,
    //             message: err.message
    //         },
    //      }));
    // }
}