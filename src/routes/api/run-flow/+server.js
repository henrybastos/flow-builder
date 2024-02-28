import puppeteer from "puppeteer-extra";
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { EnvHandler } from "$lib/EnvHandler";

import ServerLogger from "./ServerLogger"
import Operations from "./Operations";

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

export async function POST ({ request }) {
    const payload = await request.json();
    let responsePayload = {};
    console.dir(('SERVER PAYLOAD', payload), { depth: null });

    console.log('Calling local endpoint: /api/run-flow');

    const stream = new ReadableStream({
        async start(controller) {
            ServerLogger._setController(controller);
            const { browser } = await _startEngine();

            if (!payload.config.ws_endpoint) {

                ServerLogger.logEvent('system', {
                    message: `WS Endpoint: ${ browser.wsEndpoint() }`,
                    status_message: 'info'
                });
            }

            await _execStream(browser);
        }
    });  

    async function _startEngine () {
        // Avoids unwanted detection
        puppeteer.use(pluginStealth());
        const browser = await _connectOrLaunchBrowser();
        const [page] = await browser.pages();

        page.setViewport({ width: 1366, height: 720 });

        // FIXME
        page.on('dialog', async (dialog) => {
            // Required to reload the page on "Create Jivo PT" flow preset.
            if (page.url().match(/app.jivosite.com/gi)) { await dialog.accept() }
        });

        await page.setExtraHTTPHeaders({ 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)  Safari/537.36', 
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
            'accept-encoding': 'gzip, deflate, br', 
            'accept-language': 'en-US,en;q=0.9,en;q=0.8'
        }); 

        Operations._setMainPage(page);
        Operations._setBrowser(browser);

        return { page, browser };
    }

    async function _connectOrLaunchBrowser () {
        let _browser;
        const width = 1366;
        const height = 720;

        if (payload.config.ws_endpoint) {
            console.log(`Attempting to connect at ${ payload.config.ws_endpoint }...`);
            _browser = await puppeteer.connect({ browserWSEndpoint: payload.config.ws_endpoint });
            console.log(`Browser connected at ${ payload.config.ws_endpoint }`);
        } else {
            _browser = await puppeteer.launch({
                dumpio: true,
                headless: payload.config.headless,
                ...(import.meta.env.VITE_PUPPETEER_EXECUTABLE_PATH && {executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'}),
                args: [
                    `--window-size=${ width },${ height + 200 }`,
                ]
            });
            console.log(`New browser launched: ${ _browser.wsEndpoint() }`);
        }

        return _browser;
    }

    async function _runFlowForEach ({ env_var, flow }, _env) {
        const replacedEnv = EnvHandler.checkPlaceholders(env_var, _env);

        for (const _scoped_env of replacedEnv) {
            await runFlow(payload.flows[flow], _scoped_env);
        }
    }

    async function evalOperation (_operation, _env) {
        if (!_operation.enabled) {
            return;
        }
        
        if (logCommands) {
            console.log(_operation);
        }
        
        for (const [_input_name, _input_value] of Object.entries(_operation)) {
            if (EnvHandler.ENV_VARIABLES_INPUT_ALLOWLIST.includes(_input_name)) {
                _operation[_input_name] = EnvHandler.checkPlaceholders(_input_value, _env);
            }
        }
        
        Operations._setPayload(payload);
        console.log(`Operation: ${ _operation.command }`);

        // Calls the operation
        switch (_operation.command) {
            case 'check_element':
                await runFlow(payload.flows[await Operations.check_element(_operation)], _env);
                break;
            case 'branch_eval':
                await runFlow(payload.flows[await Operations.branch_eval(_operation)], _env);
                break;
            case 'run_flow':
                await runFlow(payload.flows[_operation.flow], _env);
                break;
            case 'run_flow_for_each':
                await _runFlowForEach(_operation, _env)
                break;
            case 'set_env':
                Operations.set_env(_operation, _env);
                break;
            case 'eval_expression':
                for (let [key, value] of Object.entries(await Operations.eval_expression(_operation) || {})) {
                    // Verifies for potentially unsafe code
                    if (key.replaceAll(/[\w|\.]*/g, '').length === 0) {
                        try {
                            // FIXME: Support for object queries
                            // eval(`responsePayload.${ key } = value`);
                            // eval(`payload.env.${ key } = value`);
                            responsePayload[key] = value;
                            payload.env[key] = value;
                            console.log('[ENV]', _env);
                            console.log('[RESPONSE PAYLOAD]', responsePayload);
                        } catch (err) {
                            console.error('[ENV EVAL ERROR]', err);
                            ServerLogger.logEvent('error', { message: `${ err.name } :: ${ err.message }` });
                        }
                    } else {
                        console.error('[ENV EVAL ERROR] Invalid env query (potentially harmfull).');
                        ServerLogger.logEvent('error', { message: 'Invalid env query (potentially harmfull).' });
                    }
                }

                EnvHandler.setResponsePayload(responsePayload);
                console.log('[RESPONSE PAYLOAD]', responsePayload);
                break;
            default:
                if (_operation?.response_slot) {
                    responsePayload[_operation.response_slot] = await Operations[_operation.command](_operation);
                    EnvHandler.setResponsePayload(responsePayload);
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

    async function _execStream (browser) {
        try {  
            EnvHandler.setGlobalEnv(payload.env);
            await runFlow(payload.flows.main_flow, payload.env);
    
            if (!payload.config.ws_endpoint && payload.config.close_browser_on_finish) {
                await browser.close();
            }

            ServerLogger.logEvent('response', {
                message: 'All operations done.',
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

            await Operations.screenshot({ filename: 'last_error.png' });
            
            ServerLogger.closeStream();
        }
    }   
    
    return new Response(stream, {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive'
        }
    });   
}