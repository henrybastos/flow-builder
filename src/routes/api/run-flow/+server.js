import puppeteer from "puppeteer-extra";
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { checkEnvVars, globalPlaceholderMatchRegExp, placeholderMatchRegExp } from "$lib/utils.js";

import ServerLogger from "./ServerLogger"
import Operations from "./Operations";

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

const ENV_VARIABLES_INPUT_ALLOWLIST = [
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
    // const [page, browser] = await _startEngine();
    const { browser } = await _startEngine();
    let responsePayload = {};

    console.log('Calling local endpoint: [::1]:5173/api/run-flow');

    const stream = new ReadableStream({
        async start(controller) {
            ServerLogger._setController(controller);
            if (!payload.config.ws_endpoint) {
                ServerLogger.logEvent('system', {
                    message: `WS Endpoint: ${ browser.wsEndpoint() }`,
                    status_message: 'info'
                });
            }

            await _execStream();
        }
    });  

    async function _startEngine () {
        // Avoids unwanted detection
        puppeteer.use(pluginStealth());
        const browser = await _connectOrLaunchBrowser();
        
        const [page] = await browser.pages();

        page.on('dialog', async (dialog) => {
            await dialog.accept();
        });

        await page.setExtraHTTPHeaders({ 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)  Safari/537.36', 
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
            'accept-encoding': 'gzip, deflate, br', 
            'accept-language': 'en-US,en;q=0.9,en;q=0.8' 
        }); 

        Operations._setPage(page);
        Operations._setBrowser(browser);

        return { page, browser };
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

    async function _runFlowForEach ({ env_var, flow }, _env) {
        // Resolves dot notation problem
        // const _env = checkEnvVars(env_var, payload.env);
        const replacedEnv = resolveEnv(env_var, _env);
        console.log('FOR EACH', _env, replacedEnv);

        for (const _scoped_env of replacedEnv) {
            await runFlow(payload.flows[flow], _scoped_env);
        }
    }

    function resolveEnv (_str, _env) {
        _env = _str.match(globalPlaceholderMatchRegExp) ? payload.env : _env;
        console.log('SCOPE', _str, _str.match(globalPlaceholderMatchRegExp), _env);
        const checkResult = checkEnvVars(_str, _env);

        if (checkResult && checkResult.match(placeholderMatchRegExp)) {
            if (!checkResult) {
                ServerLogger.logEvent('error', {
                    message: `Env variable not found: ${ _str }`,
                    status_message: 'error'
                });
            }

            return resolveEnv(checkResult, _env);
        } 

        return checkResult;
    }

    async function evalOperation (_operation, _env) {
        if (logCommands) {
            console.log(_operation);
        }

        for (const [_input_name, _input_value] of Object.entries(_operation)) {
            if (ENV_VARIABLES_INPUT_ALLOWLIST.includes(_input_name) && _input_value.match(placeholderMatchRegExp)) {
                console.log('ENV', _env);
                const replacedEnv = resolveEnv(_input_value, _env);
                console.log('RESOLVED ENV', replacedEnv);
                const needsReplacementInString = _input_value.replaceAll(placeholderMatchRegExp, '') && _input_value.match(placeholderMatchRegExp);
                _operation[_input_name] = needsReplacementInString ? _input_value.replace(placeholderMatchRegExp, replacedEnv) : replacedEnv;
            } else {
                console.log('OPERATION', _operation);
            }
        }
        
        Operations._setPayload(payload);

        console.log(`Operation: ${ _operation.command }`);

        // Calls the operation
        switch (_operation.command) {
            case 'check_element':
                await runFlow(payload.flows[await Operations.checkElement(_operation)], payload.env);
                break;
            case 'run_flow':
                await runFlow(payload.flows[_operation.flow], _env);
                break;
            case 'run_flow_for_each':
                await _runFlowForEach(_operation, _env)
                break;
            default:
                if (_operation?.response_slot) {
                    responsePayload[_operation.response_slot] = await Operations[_operation.command](_operation);
                } else {
                    await Operations[_operation.command](_operation);
                }
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