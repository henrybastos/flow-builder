import ServerLogger from "./ServerLogger"

export default class Operations {
    /**
     * Sets the page which the operation will work with.
     * @param {import('puppeteer').Page} _page 
     */
    static _setPage (_page) {
        this.page = _page;
    }

    static async goto({ target }) {
        ServerLogger.logEvent('operation_log', {
            message: `Navigating to: ${ target }`,
            status_message: 'info'
        });
        
        await this.page.goto(target, { waitUntil: 'networkidle0' });
    }
}

// Operations._setPage(page);
// Operations.goto(_operation);