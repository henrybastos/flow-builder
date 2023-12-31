import ServerLogger from "./ServerLogger"

export default class Operations {
    /**
     * Sets the page which the operation will work with.
     * @param {import('puppeteer').Page} _page 
     */
    static _setPage (_page) {
        this.page = _page;
    }

    static _setBrowser (_browser) {
        this.browser = _browser;
    }

    static _setPayload (_payload) {
        this.payload = _payload;
    }

    static async goto({ target }) {
        ServerLogger.logEvent('operation_log', {
            message: `Navigating to: ${ target }`,
            status_message: 'info'
        });
        
        await this.page.goto(target, { waitUntil: 'networkidle0' });
    }

    static async wait_for_selector (_target, timeout = 15000 ) {
        await this.page.waitForSelector(`xpath/${ _target }`, { timeout });
    }

    static async getElement (_target) {
        await this.wait_for_selector(_target, this.payload?.wait_timeout);
        return await this.page.$$(`xpath/${ _target }`);
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

    static async scrape_attr ({ target, attr }) {
        const [element] = await this.getElement(target);

        ServerLogger.logEvent('operation_log', {
            message: `Scrapping ${ attr } from ${ target }`,
            status_message: 'info'
        });

        return await element.evaluate((dom_el, _attr) => dom_el[_attr], attr);
    }

    static async scrape_multiple_attr ({ target, attr }) {
        const elements = await this.getElement(target);
        let scraped_attributes = [];

        ServerLogger.logEvent('operation_log', {
            message: `Scrapping multiple ${ attr } from ${ target }`,
            status_message: 'info'
        });

        for (const _el of elements) {
            scraped_attributes.push(await _el.evaluate((dom_el, _attr) => dom_el[_attr], attr));
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
    static async set_env ({ env_var, value }, _env) {
        eval(`_env.${ env_var } = value`);
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
            await this.page.waitForNavigation();
        } catch (err) {
            ServerLogger.logEvent('operation_log', {
                message: `Failed to wait for navigation`,
                status_message: 'error'
            });
        }
    }

    static async reload () {
        await this.page.reload({ waitUntil: ['networkidle0', "domcontentloaded"] });
    }

    static async press_key ({ key }) {
        ServerLogger.logEvent('operation_log', {
            message: `Pressing key: ${ key }`,
            status_message: 'info'
        });

        await this.page.keyboard.press(key);
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
            await this.page.keyboard.down(key);
        }
        
        for(const key of keys) {
            await this.page.keyboard.press(key);
        }
        
        for(const key of mod_keys) {
            await this.page.keyboard.up(key);
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

        await this.browser.close();
    }

    static async extract_param_from_url ({ param }) {
        ServerLogger.logEvent('operation_log', {
            message: `Retrieving parameter  ${ param }...`,
            status_message: 'info'
        });
        
        const urlSearchParams = new URLSearchParams(await this.page.evaluate(() => window.location.search));
        return urlSearchParams.get(param);
    }

    static async extract_route_from_url ({ regex }) {
        ServerLogger.logEvent('operation_log', {
            message: `Retrieving route  ${ regex }...`,
            status_message: 'info'
        });

        // const pathnameRegex = new RegExp('(?<=/cursos/[0-9]*/editar/modulos/).*(?=/aula/)', 'g')
        const pathnameRegex = new RegExp(regex, 'g');
        const urlPathname = await this.page.evaluate(() => window.location.pathname)
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
}