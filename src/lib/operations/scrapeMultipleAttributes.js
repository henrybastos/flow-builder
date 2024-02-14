async function scrape_multiple_attr ({ target, attr }) {
    const elements = await this.getElement(target);
    let scraped_attributes = [];

    this.logger.logEvent('operation_log', {
        message: `Scrapping multiple ${ attr } from ${ target }`,
        status_message: 'info'
    });

    for (const _el of elements) {
        // scraped_attributes.push({ [response_slot]: [await _el.evaluate((dom_el, _attr) => dom_el[_attr] || dom_el.getAttribute(_attr), attr)] });
        scraped_attributes.push(await _el.evaluate((dom_el, _attr) => dom_el[_attr] || dom_el.getAttribute(_attr), attr));
    }

    return scraped_attributes;
}

export default scrape_multiple_attr;