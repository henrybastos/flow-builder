async function keyboard_type ({ target, value, trigger_onchange_on_tab }) {
    const [element] = await this.getElement(target);

    this.logger.logEvent('operation_log', {
        message: `Typing ${ value } to ${ target }`,
        status_message: 'info'
    });

    await element.type(value.toString());

    /** Optional. Causes the onchange event to trigger. */
    if (trigger_onchange_on_tab) {
        this.press_key({ key: 'Tab' })
    }
}

export default keyboard_type;