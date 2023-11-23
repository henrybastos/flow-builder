import ServerLogger from "./ServerLogger"

export default class Operations {
    /**
     * Sets the page which the operation will work with.
     * @param {import('puppeteer').Page} _page 
     */
    static _setPage (_page) {
        this.page = _page;
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

    static async waitForSelector (_target, timeout = 15000 ) {
        await this.page.waitForSelector(`xpath/${ _target }`, { timeout });
    }

    static async getElement (_target) {
        await this.waitForSelector(_target, this.payload?.wait_timeout);
        return await this.page.$$(`xpath/${ _target }`);
    }

    static async clickElement ({ target }, _click_type = 'machine') {
        ServerLogger.logEvent('operation_log', {
            message: `Clicking element: ${ target }`,
            status_message: 'info'
        });

        const [element] = await this.getElement(target);

        if (_click_type === 'user') {
            await element.click();
        } else {
            await element.evaluate(el => el.click());
        }
        // Needs inspecition
        // for (let i = count; i > 0; i--) {
        // }
    }

    static async typeElement ({ target, value }) {
        const [element] = await this.getElement(target);
        await element.type(value);
    }

    static async selectInputValue ({ target }) {
        const [element] = await this.getElement(target);
        return await element.evaluate(el => el.select());
    }

    static async scrapeAttribute ({ target, attr }) {
        const [element] = await this.getElement(target);
        return await element.evaluate((el, _attr) => el[_attr], attr);
    }

    static async scrapeMultipleAttributes ({ target, attr }) {
        let scraped_attributes = [];
        const elements = await this.getElement(target);

        for (const _el of elements) {
            scraped_attributes.push(await _el.evaluate((el, _attr) => el[_attr], attr));
        }
        return scraped_attributes;
    }

    static async setAttribute ({ target, attr, value }) {
        const [element] = await this.getElement(target);
        return await element.evaluate((el, _attr, _value) => el[_attr] = _value, attr, value);
    }

    static async evaluateRegex ({ target, regex }) {
        const [element] = await this.getElement(target);
        return await element.evaluate((el, _regex) => el.value.match(new RegExp(_regex, 'g')), regex);
    }

    /**
     * 
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

    static async chromePickerSetColor ({ trigger_target, picker_target, color }) {
        await this.clickElement({ target: trigger_target });
        await this.clickElement({ target: picker_target }, 'user');
        await this.selectInputValue({ target: picker_target });
        await this.typeElement({ target: picker_target, value: color });
    }    

    static async waitForNavigation () {
        await this.page.waitForNavigation();
    }
}

// Operations._setPage(page);
// Operations.goto(_operation);