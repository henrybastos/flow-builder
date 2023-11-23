import puppeteer from "puppeteer-extra";
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { checkForEnvPlaceholder, trimEnvPlaceholder, replaceEnvPlaceholder } from "$lib/utils.js";

import comboKeys from "$lib/operations/comboKeys";
import ServerLogger from "./ServerLogger"
import Operations from "./operations";

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

const logCommands = false;

const ENV_VARIABLES_ALLOWLIST = [
    'target',
    'trigger_target',
    'picker_target',
    'color',
    'key',
    'mod_keys',
    'keys',
    'response_slot',
    'time',
    'value'
]

export async function POST ({ request }) {
    const payload = await request.json();
    const [page, browser] = await _startEngine();
    let responsePayload = {};

    console.log('Calling local endpoint: [::1]:5173/api/run-flow');

    const stream = new ReadableStream({
        async start(controller) {
            ServerLogger._setController(controller);
            ServerLogger.logEvent('system', {
                message: `WS Endpoint: ${ browser.wsEndpoint() }`,
                status_message: 'info'
            });
            
            await _execStream();
        }
    });  

    async function _startEngine () {
        
        puppeteer.use(pluginStealth())
        const browser = await _connectOrLaunchBrowser();
        
        const [page] = await browser.pages();

        Operations._setPage(page);

        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        await page.setExtraHTTPHeaders({ 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36', 
            'upgrade-insecure-requests': '1', 
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
            'accept-encoding': 'gzip, deflate, br', 
            'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
        }); 

        return [page, browser];
    }

    async function _connectOrLaunchBrowser () {
        let _browser;
        const width = 1366;
        const height = 720;

        // Tries to connect to a running browser instance. If it fails, it launches a new one.
        try {
            console.log(`Attempting to connect at ${ payload.config.ws_endpoint }...`);
            _browser = await puppeteer.connect({ browserWSEndpoint: payload.config.ws_endpoint });
            console.log(`Browser connected at ${ payload.config.ws_endpoint }`);
        } catch (_err) {
            console.error(`Failed to connect at ${ payload.config.ws_endpoint }. Launching a new browser...`);
            
            _browser = await puppeteer.launch({
                headless: false,
                executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
                args: [
                    `--window-size=${ width },${ height + 200 }`
                ],
                defaultViewport: {
                    width,
                    height
                }
            });

            console.log(`New browser launched: ${ _browser.wsEndpoint() }`);
        }

        return _browser;
    }

    async function _waitForSelector (_target, _timeout = 15000) {
        await page.waitForSelector(`xpath/${ _target }`, {
            timeout: _timeout
        });
    }

    async function _getElement (_target) {
        await _waitForSelector(_target, payload?.wait_timeout);
        return await page.$$(`xpath/${ _target }`);
    }

    async function _clickElement ({ target }, _click_type = 'machine') {
        const [_element] = await _getElement(target);

        if (_click_type === 'user') {
            await _element.click();
        } else {
            await _element.evaluate(el => el.click());
        }
        // Needs inspecition
        // for (let i = count; i > 0; i--) {
        // }
    }

    async function _typeElement ({ target, value }) {
        const [_element] = await _getElement(target);
        await _element.type(value);
    }

    async function _selectInputValue ({ target }) {
        const [_element] = await _getElement(target);
        return await _element.evaluate(el => el.select());
    }

    async function _scrapeAttribute ({ target, attr }) {
        const [_element] = await _getElement(target);
        return await _element.evaluate((el, _attr) => el[_attr], attr);
    }

    async function _scrapeMultipleAttributes ({ target, attr }) {
        let _returnObj = [];
        const _elements = await _getElement(target);

        for (const _el of _elements) {
            _returnObj.push(await _el.evaluate((el, _attr) => el[_attr], attr));
        }
        return _returnObj;
    }

    async function _setAttribute ({ target, attr, value }) {
        const [_element] = await _getElement(target);
        return await _element.evaluate((el, _attr, _value) => el[_attr] = _value, attr, value);
    }

    async function _evaluateRegex ({ target, regex }) {
        const [_element] = await _getElement(target);
        return await _element.evaluate((el, _regex) => el.value.match(new RegExp(_regex, 'g')), regex);
    }

    /**
     * 
     * @param {{ target: string, success_flow: string, error_flow: string }} operation 
     * @returns The name of the flow (success or error).
     */
    async function _checkElement ({ target, success_flow, error_flow }) {
        try {
            await _getElement(target);
            console.log(`Running flow: ${ success_flow }`);
            return success_flow;
        } catch (err) {
            console.log(err);
            console.log(`Running flow: ${ error_flow }`);
            return error_flow;
        }
    }

    async function _runFlowForEach ({ env_var, flow }) {
        const envVar = trimEnvPlaceholder(env_var);
        
        for (const _env of payload.env[envVar]) {
            await runFlow(payload.flows[flow], _env);
        }
    }

    function _checkEnvVars (_env, _field_name, _field_value) {
        if (ENV_VARIABLES_ALLOWLIST.includes(_field_name) && checkForEnvPlaceholder(_field_value)) {
            return replaceEnvPlaceholder(_field_value, _env);
        }

        return _field_value;
    }

    async function evalOperation (_operation, _env) {
        if (logCommands) {
            console.log(_operation);
        }

        for (const [_input_name, _input_value] of Object.entries(_operation)) {
            _operation[_input_name] = _checkEnvVars(_env, _input_name, _input_value);
        }
        await Operations.goto(_operation);
        switch (_operation.command) {
            case 'goto':    
                break;
            case 'reload':    
                await page.reload({ waitUntil: ['networkidle0', "domcontentloaded"] });
                break;
            case 'wait_navigation':    
                await page.waitForNavigation();
                break;
            case 'chrome_picker_set_color':    
                await _clickElement({ target: _operation.trigger_target });
                await _clickElement({ target: _operation.picker_target }, 'user');
                await _selectInputValue({ target: _operation.picker_target });
                await _typeElement({ target: _operation.picker_target, value: _operation.color });
                break;
            case 'click':
                ServerLogger.logEvent('operation_log', {
                    message: `Clicking element: ${ _operation.target }`,
                    status_message: 'info'
                });

                await _clickElement(_operation);
                break;
            case 'user_click':    
                ServerLogger.logEvent('operation_log', {
                    message: `User clicking element: ${ _operation.target }`,
                    status_message: 'info'
                });
                
                await _clickElement(_operation, 'user');
                break;
            case 'type':
                ServerLogger.logEvent('operation_log', {
                    message: `Typing ${ _operation.value } to ${ _operation.target }`,
                    status_message: 'info'
                });

                await _typeElement(_operation);
                break;
            case 'select':
                await _selectInputValue(_operation);
                break;
            case 'press_key':
                await page.keyboard.press(_operation.key);
                break;
            case 'combo_keys':
                await comboKeys(page, _operation.key, _operation.mod_keys);
                break;
            case 'scrape_attr':
                ServerLogger.logEvent('operation_log', {
                    message: `Scrapping ${ _operation.attr } from ${ _operation.target }`,
                    status_message: 'info'
                });

                responsePayload[_operation.response_slot] = await _scrapeAttribute(_operation);
                break;
            case 'scrape_multiple_attr':
                ServerLogger.logEvent('operation_log', {
                    message: `Scrapping multiple ${ _operation.attr } from ${ _operation.target }`,
                    status_message: 'info'
                });

                responsePayload[_operation.response_slot] = await _scrapeMultipleAttributes(_operation);
                break;
            case 'set_attr':
                responsePayload[_operation.response_slot] = await _setAttribute(_operation);
                break;
            case 'check_element':
                await runFlow(payload.flows[await _checkElement(_operation)], payload.env);
                break;
            case 'run_flow':
                await runFlow(payload.flows[_operation.flow], payload.env);
                break;
            case 'run_flow_for_each':
                await _runFlowForEach(_operation)
                break;
            case 'eval_regex':
                responsePayload[_operation.response_slot] = await _evaluateRegex(_operation);
                break;
            case 'wait_seconds':
                await new Promise((res) => {
                    setTimeout(res, _operation.time);
                });
                console.log("Times' up!");
                break;
            case 'set_payload_slot':
                responsePayload[_operation.response_slot] = _operation.value;
                break;
            case 'wait_for_selector':
                await _waitForSelector(_operation.target, _operation.timeout);
                break;
            case 'close_browser':
                await browser.close();
                console.log('All done!');
                break;
        }
    }

    async function runFlow (_flow, _env) {
        for(const operation of _flow) {
            // Avoids replacement issues with repeatears like Run Flow For Each
            let operationCopy = structuredClone(operation);
            await evalOperation(operationCopy, _env);
        }
    }

    async function _execStream () {
        try {  
            await runFlow(payload.flows.main_flow, payload.env);
    
            if (!payload.config.ws_endpoint && payload.config.close_browser_on_finish) {
                await browser.close();
            }
            
            // console.dir(responsePayload, { depth: null });

            ServerLogger.logEvent('response', {
                message: 'All operations done.',
                status_code: 200,
                status_message: 'success',
                ws_endpoint: browser.wsEndpoint(),
                payload: responsePayload
            });

            ServerLogger.closeStream();
        } catch (err) {
            console.log(err);

            ServerLogger.logEvent('error', {
                message: `${ err.name } :: ${ err.message }`,
                status_code: 500,
                status_message: 'error'
            });
            
            ServerLogger.closeStream();
        }
    }   
    
    return new Response(stream, {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive',
        }
    });   
}