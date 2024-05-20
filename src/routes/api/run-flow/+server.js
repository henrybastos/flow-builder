import puppeteer from "puppeteer-extra";
import pluginStealth from 'puppeteer-extra-plugin-stealth';
import { EnvHandler } from "$lib/EnvHandler";
import { removeKeyFlags, replaceEnvPlaceholders, fillUndefinedQueryMembers } from "./operationUtils";

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

        page.on('close', () => {
            console.log('Page is closed');
        });

        await page.setExtraHTTPHeaders({ 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)  Safari/537.36', 
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
            'accept-encoding': 'gzip, deflate, br', 
            'accept-language': 'pt-BR,en-US,en;q=0.9,en;q=0.8'
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
                ...(import.meta.env.VITE_PUPPETEER_EXECUTABLE_PATH && {executablePath: import.meta.env.VITE_PUPPETEER_EXECUTABLE_PATH}),
                args: [
                    `--window-size=${ width },${ height + 200 }`,
                    // '--disable-features=IsolateOrigins,site-per-process'
                ]
            });
            console.log(`New browser launched: ${ _browser.wsEndpoint() }`);
        }

        return _browser;
    }

    async function _runFlowForEach ({ env_var, flow }, _env) {
        const replacedEnv = EnvHandler.checkPlaceholders(env_var, _env);
        console.log('[RUN FLOW FOR EACH]', replacedEnv);

        for (const [i, _scoped_env] of Object.entries(replacedEnv)) {
            console.log('[TEST]', replacedEnv);
            _scoped_env._index = i;
            _scoped_env._length = Object.keys(replacedEnv).length.toString();
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
        
        
        replaceEnvPlaceholders(_operation, _env);
        Operations._setPayload(payload);
        await Operations._injectFunctions();
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
            case 'run_flow_iterations':
                await Operations.runIterations(async () => await runFlow(payload.flows[_operation.flow], _env), _operation, _env);
                break;
            case 'run_flow_for_each':
                await _runFlowForEach(_operation, _env)
                break;
            case 'set_env':
                Operations.set_env(_operation, _env);
                break;
            case 'eval_expression':
                for (let [key, value] of Object.entries(await Operations.eval_expression(_operation) || {})) {
                    console.log('[EVAL KEY]', key);
                    try {
                        /**
                         * Flags to modify the code behaviour. Can be stacked (e.g.: `@scoped:@query:user.info.email`)
                         * 
                         * @property {boolean} query - Support for object queries/dot notation (e.g.: `user.info.name`).
                         * @property {boolean} scoped - Whether it uses `payload.env` (global/absolute) of `_env` (local/relative).
                         */
                        let flags = {
                            private: false,
                            scoped: false,
                            query: false
                        }

                        flags.private = key.match(/@private:/g);
                        flags.scoped = key.match(/@scoped:/g);
                        flags.query = key.match(/@query:/g);

                        // Cleans out the flags from the key
                        // key = key.replace(/(@query:|@scoped:|@expose:)/g, '');
                        key = removeKeyFlags(key);

                        if (flags.query) {
                            if (flags.scoped) {
                                fillUndefinedQueryMembers(`${key}`, _env);
                                eval(`_env.${key} = value`);
                            } else {
                                fillUndefinedQueryMembers(`${key}`, payload.env);
                                eval(`payload.env.${key} = value`);
                            }
            
                            if (!flags.private) {
                                fillUndefinedQueryMembers(`${key}`, responsePayload);
                                eval(`responsePayload.${key} = value`);
                            }
                        } else {
                            console.log('ENV VALUE', value);

                            if (flags.scoped) {
                                _env[key] = value;
                            } else {
                                payload.env[key] = value;
                            }

                            if (!flags.private) {
                                responsePayload[key] = value;
                            }
                        }
                    } catch (err) {
                        console.error('[ENV EVAL ERROR]', err);
                        ServerLogger.logEvent('error', { message: `${ err.name } :: ${ err.message }` });
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

        console.log('[ENV]');
        console.dir(_env, { depth: null });
        
        console.log('[GLOBAL ENV]');
        console.dir(payload.env, { depth: null });
        
        console.log('[RESPONSE PAYLOAD]');
        console.dir(responsePayload, { depth: null });
    }

    async function runFlow (_flow, _env) {
        if (!_flow) { return };

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
        } catch (err) {
            console.log(err);

            ServerLogger.logEvent('error', {
                message: `${ err.name } :: ${ err.message }`,
                status_code: 500,
                status_message: 'error'
            });

            await Operations.screenshot({ filename: 'last_error.png' });
            
        } finally {
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