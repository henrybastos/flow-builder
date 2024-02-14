async function scrape_attr ({ target, attr }) {
    const [element] = await this.getElement(target);

    this.logger.logEvent('operation_log', {
        message: `Scrapping ${ attr } from ${ target }`,
        status_message: 'info'
    });

    return await element.evaluate((dom_el, _attr) => dom_el[_attr], attr);
}

export default scrape_attr;