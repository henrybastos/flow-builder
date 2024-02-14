async function set_attr ({ target, attr, value }) {
    const [element] = await this.getElement(target);

    this.logger.logEvent("operation_log", {
        message: `Setting attribute ${ attr } to ${ value } for element ${ target }`,
        status_message: 'info'
    });

    return await element.evaluate((dom_el, _attr, _value) => dom_el[_attr] = _value, attr, value);
}

export default set_attr;