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
        try {
            await this.page.waitForSelector(`xpath/${ _target }`, { timeout });
        } catch (error) {
            console.error(error);
            ServerLogger.logEvent('operation_log', {
                message: `Could not find selector  ${ _target }`,
                status_message: 'error'
            });
        }
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

    static async eval_regex ({ target, regex }) {
        const [element] = await this.getElement(target);
        return await element.evaluate((dom_el, _regex) => dom_el.value.match(new RegExp(_regex, 'g')), regex);
    }

    /**
     * @param {{ target: string, success_flow: string, error_flow: string }} operation 
     * @returns The name of the flow (success or error).
     */
    static async checkElement ({ target, success_flow, error_flow }) {
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

    static async wait_navigation () {
        await this.page.waitForNavigation();
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
}