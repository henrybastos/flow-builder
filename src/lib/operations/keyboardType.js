async function keyboard_type ({ target, value }) {
    const [element] = await this.getElement(target);

    this.logger.logEvent('operation_log', {
        message: `Typing ${ value } to ${ target }`,
        status_message: 'info'
    });

    await element.type(value);
}

export default keyboard_type;