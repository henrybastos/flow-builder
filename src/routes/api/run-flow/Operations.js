import ServerLogger from "./ServerLogger"
import { scrape_attr } from "$lib/operations/scrapeAttribute";

export default class Operations {
    static pages = [];
    static logger = ServerLogger;

    static scrape_attr = scrape_attr;

    static __flow_builder_are_funcs_injected__ = false;
    static __flow_builder_injection_funcs__ = {
        x: (path) => document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue,
        xxx: (path) => {
            const nodesSnapshot = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            let elements = [];
            for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
                elements.push(nodesSnapshot.snapshotItem(i));
            }
            return elements;
        },
        goto: (href) => { window.location.href = href },
        download_blob: async (filename, link) => {
            // Hoping it resolves CORS problems
            
            let startTime = Date.now();

            console.log(`[${ new Date().toLocaleTimeString() }] Fetching url...`);
            const response = await fetch(link);
            console.log(`[${ new Date().toLocaleTimeString() }] Converting to blob...`);
            const blobImage = await response.blob();
            const href = URL.createObjectURL(blobImage);
            
            const anchor = document.createElement('a');
            anchor.setAttribute('download', filename);
            anchor.setAttribute('href', href);
            
            document.querySelector('body').appendChild(anchor);
            console.log(`[${ new Date().toLocaleTimeString() }] Downloading...`);
            anchor.click();

            let elapsedTime = Math.ceil(Date.now() - startTime);
            let formattedElapsedTime = `${ Math.floor((elapsedTime / 1000) / 60) }m ${ Math.floor((elapsedTime / 1000) % 60) }s ${ Math.floor(elapsedTime % 1000) }ms`

            console.log(`[${ new Date().toLocaleTimeString() }] Done`);
            console.log(`Elapsed time: ${ formattedElapsedTime }`);
        },
        download_yt_video: async (filename) => {
            const ytPayload = JSON.parse(x("//*/script[contains(text(), 'var ytInitialPlayerResponse')]").innerText
                    .replace('var ytInitialPlayerResponse = ', '')
                    .replace(/(;$|;var (meta|head).*)/, ''))

            console.log();

            const [hd] = ytPayload.streamingData.formats.filter(({ qualityLabel }) => qualityLabel == '720p').map(({ url, quality, audioQuality, fps }) => {
                return {
                    fps,
                    audioQuality,
                    quality,
                    url: decodeURIComponent(url)
                }
            });
            // console.log(hd);
            goto(hd.url);
            // await download_blob(filename, fhd.url);
            // return fhd.url;
        }
    }    

    /**
     * Code extracted from https://stackoverflow.com/questions/52497252/puppeteer-wait-until-page-is-completely-loaded
     * by Anand Mahajan and Arel
     * @param {import type { Page } from "puppeteer";} page 
     * @param {number} timeout 
     */
    static async _waitTillHTMLRendered (page, timeout = 30000) {
        const checkDurationMsecs = 1000;
        const maxChecks = timeout / checkDurationMsecs;
        let lastHTMLSize = 0;
        let checkCounts = 1;
        let countStableSizeIterations = 0;
        const minStableSizeIterations = 3;
      
        while(checkCounts++ <= maxChecks){
          let html = await page.content();
          let currentHTMLSize = html.length; 
      
          let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
      
          console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
      
          if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
            countStableSizeIterations++;
          else 
            countStableSizeIterations = 0; //reset the counter
      
          if(countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
          }
      
          lastHTMLSize = currentHTMLSize;
          await page.waitForTimeout(checkDurationMsecs);
        }  
      }

    /**
     * Sets the page which the operation will work with.
     * @param {import('puppeteer').Page} _page 
     */
    static _setPage (_page) {
        this.curr_page = _page;
        console.log('SET PAGE');
    }

    static _setBrowser (_browser) {
        this.browser = _browser;
    }

    static _setPayload (_payload) {
        this.payload = _payload;
    }

    static async _injectFunctions () {
        for (let [fn_name, fn_func] of Object.entries(this.__flow_builder_injection_funcs__)) {
            if (!await this.curr_page.evaluate(`try { ${ fn_name } } catch (err) { false }`)) {
                console.log('[FUNC INJECTION]: Injecting function', fn_name);
                // Injects the functions into the page, so it can be used with evaluate.
                // console.log(`[FUNC] ${fn_name} :: const ${ fn_name } = ${ fn_func }`);
                await this.curr_page.evaluate(`const ${ fn_name } = ${ fn_func }`);
            }
        }
    }

    static async goto({ target }) {
        ServerLogger.logEvent('operation_log', {
            message: `Navigating to: ${ target }`,
            status_message: 'info'
        });
        
        await this.curr_page.goto(target, { waitUntil: 'networkidle0' });
    }

    static async wait_for_selector ({ target, timeout = 15000 }) {
        await this.curr_page.waitForSelector(`xpath/${ target }`, { timeout });

        ServerLogger.logEvent('operation_log', {
            message: `Waiting for element ${ target } has ended.`,
            status_message: "info"
        });
    }

    static async getElement (_target) {
        await this.wait_for_selector({ target: _target, timeout: this.payload?.wait_timeout });
        return await this.curr_page.$$(`xpath/${ _target }`);
    }

    static async user_click ({ target }) {
        const [element] = await this.getElement(target);

        ServerLogger.logEvent('operation_log', {
            message: `User clicking element: ${ target }`,
            status_message: 'info'
        });

        await element.click();

        // Needs inspecition
        // for (let i = count; i > 0; i--) {
        // }
    }

    static async click ({ target }) {
        const [element] = await this.getElement(target);

        ServerLogger.logEvent('operation_log', {
            message: `Clicking element: ${ target }`,
            status_message: 'info'
        });

        await element.evaluate(el => el.click());
    }

    static async type ({ target, value }) {
        const [element] = await this.getElement(target);

        ServerLogger.logEvent('operation_log', {
            message: `Typing ${ value } to ${ target }`,
            status_message: 'info'
        });

        await element.type(value);
    }

    static async select_option ({ target }) {
        const [element] = await this.getElement(target);
        return await element.evaluate(dom_el => dom_el.select());
    }

    static async scrape_multiple_attr ({ target, attr }) {
        const elements = await this.getElement(target);
        let scraped_attributes = [];

        ServerLogger.logEvent('operation_log', {
            message: `Scrapping multiple ${ attr } from ${ target }`,
            status_message: 'info'
        });

        for (const _el of elements) {
            // scraped_attributes.push({ [response_slot]: [await _el.evaluate((dom_el, _attr) => dom_el[_attr] || dom_el.getAttribute(_attr), attr)] });
            scraped_attributes.push(await _el.evaluate((dom_el, _attr) => dom_el[_attr] || dom_el.getAttribute(_attr), attr));
        }

        return scraped_attributes;
    }

    static async set_attr ({ target, attr, value }) {
        const [element] = await this.getElement(target);

        ServerLogger.logEvent("operation_log", {
            message: `Setting attribute ${ attr } to ${ value } for element ${ target }`,
            status_message: 'info'
        });

        return await element.evaluate((dom_el, _attr, _value) => dom_el[_attr] = _value, attr, value);
    }

    // Disabled because of eval
    // eslint-disable-next-line no-unused-vars
    static async set_env ({ env_query, value }, _env) {
        eval(`_env.${ env_query } = value`);
        console.log('ENV', _env);
        return _env;
    }

    static async eval_regex ({ target, regex }) {
        const [element] = await this.getElement(target);
        return await element.evaluate((dom_el, _regex) => dom_el.value.match(new RegExp(_regex, 'g')), regex);
    }

    /**
     * @param {{ target: string, success_flow: string, error_flow: string }} operation 
     * @returns The name of the flow (success or error).
     */
    static async checkElement ({ target, success_flow, error_flow }) {
        console.log('CHECK.FLOWS', target, success_flow, error_flow);
        try {
            await this.getElement(target);
            console.log(`Running flow: ${ success_flow }`);
            return success_flow;
        } catch (err) {
            console.log(err);
            console.log(`Running flow: ${ error_flow }`);
            return error_flow;
        }
    }

    static async chrome_picker_set_color ({ trigger_target, picker_target, color }) {
        await this.click({ target: trigger_target });
        await this.click({ target: picker_target }, 'user');
        await this.select_option({ target: picker_target });
        await this.type({ target: picker_target, value: color });
    }    

    static async wait_for_navigation () {
        try {
            ServerLogger.logEvent('operation_log', {
                message: `Waiting for navigation...`,
                status_message: 'info'
            });
            await this.curr_page.waitForNavigation();
        } catch (err) {
            ServerLogger.logEvent('operation_log', {
                message: `Failed to wait for navigation`,
                status_message: 'error'
            });
        }
    }

    static async reload () {
        await this.curr_page.reload({ waitUntil: ['networkidle0', "domcontentloaded"] });
    }

    static async press_key ({ key }) {
        ServerLogger.logEvent('operation_log', {
            message: `Pressing key: ${ key }`,
            status_message: 'info'
        });

        await this.curr_page.keyboard.press(key);
    }

    /**
     * Press multiple keys in combo.
     * @param {{ keys: Array<string>, mod_keys: Array<string> }} operation_params
     */
    static async combo_keys ({ keys, mod_keys }) {
        ServerLogger.logEvent('operation_log', {
            message: `Pressing combo keys: ${ keys.join(', ') } + ${ mod_keys.join(', ') }`,
            status_message: "info"
        });

        for(const key of mod_keys) {
            await this.curr_page.keyboard.down(key);
        }
        
        for(const key of keys) {
            await this.curr_page.keyboard.press(key);
        }
        
        for(const key of mod_keys) {
            await this.curr_page.keyboard.up(key);
        }
    }

    static async wait_seconds ({ time }) {
        ServerLogger.logEvent("operation_log", {
            message: `Waiting ${ time } ms...`,
            status_message: "info"
        });

        return await new Promise((res) => {
            setTimeout(res, time);
        });
    }

    static async set_payload_slot ({ value }) {
        return value;
    }

    static async close_browser () {
        ServerLogger.logEvent("operation_log", {
            message: 'Closing browser...',
            status_message: "info"
        });
        
        console.log('Closing browser...');

        await this.browser.close();
    }

    static async extract_param_from_url ({ param }) {
        ServerLogger.logEvent('operation_log', {
            message: `Retrieving parameter  ${ param }...`,
            status_message: 'info'
        });
        
        const urlSearchParams = new URLSearchParams(await this.curr_page.evaluate(() => window.location.search));
        return urlSearchParams.get(param);
    }

    static async extract_route_from_url ({ regex }) {
        ServerLogger.logEvent('operation_log', {
            message: `Retrieving route  ${ regex }...`,
            status_message: 'info'
        });

        // const pathnameRegex = new RegExp('(?<=/cursos/[0-9]*/editar/modulos/).*(?=/aula/)', 'g')
        const pathnameRegex = new RegExp(regex, 'g');
        const urlPathname = await this.curr_page.evaluate(() => window.location.pathname)
        const [urlRoute] = urlPathname.match(pathnameRegex);

        ServerLogger.logEvent('operation_log', {
            message: `Route retrieved: ${ urlRoute }...`,
            status_message: 'info'
        });

        return urlRoute;
    }

    static async download_image ({ target, attr, filename }) {
        const link = await this.scrape_attr({ target, attr });
        const [element] = await this.getElement(target);

        ServerLogger.logEvent('operation_log', {
            message: `Trying to download  ${ link } ...`,
            status_message: 'info'
        });
        
        await element.evaluate(async (el, link, filename) => {
            const response = await fetch(link);
            const blobImage = await response.blob();
            const href = URL.createObjectURL(blobImage);

            const anchor = document.createElement('a');
            anchor.setAttribute('download', filename);
            anchor.setAttribute('href', href);

            document.querySelector('body').appendChild(anchor);
            anchor.click();
        }, link, filename);
    }

    static async attach_to_iframe ({ name }) {
        console.log('FRAMES', this.curr_page.frames());
        const frame = await this.curr_page.frames().find((frame) => frame.name().match(name) || frame.url().match(name));

        console.log('IFRAME', frame);
        this.curr_page = frame;
        ServerLogger.logEvent('operation_log', {
            message: `The iFrame ${ frame.url() } was set as the current page.`,
            status_message: 'info'
        });
    }

    static async detach_from_iframe () {
        console.log('PAGE TYPE', typeof this.curr_page);
        this.curr_page = this.curr_page.page();
        ServerLogger.logEvent('operation_log', {
            message: `The iFrame was detached.`,
            status_message: 'info'
        });
    }

    // WIP
    // static async select_page ({ page }) {
    //     if (typeof page === 'number') {
    //         this.curr_page = this.pages[page]
    //     } else if (typeof page === 'string') {
            
    //     }
    // }

    static async eval_expression ({ expression }) {
        await this._injectFunctions();

        ServerLogger.logEvent("operation_log", {
            message: `Waiting for DOM changes...`,
            status_message: "info"
        })
        await this._waitTillHTMLRendered(await this.curr_page, 5000);

        ServerLogger.logEvent("operation_log", {
            message: `Evaluating expression: ${ expression }`,
            status_message: "info"
        })

        let expressionReturnValue = await this.curr_page.evaluate(expression);

        ServerLogger.logEvent("operation_log", {
            message: `Expression return value: ${ expressionReturnValue }`,
            status_message: "info"
        })

        console.log('Expression return value:', expressionReturnValue);

        // if (typeof expressionReturnValue === 'object') { expressionReturnValue = JSON.stringify(expressionReturnValue) }
        
        return expressionReturnValue || 'Invalid expression return value.';
    }
}