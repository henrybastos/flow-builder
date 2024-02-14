async function click ({ target }) {
    const [element] = await this.getElement(target);

    this.logger.logEvent('operation_log', {
        message: `Clicking element: ${ target }`,
        status_message: 'info'
    });

    await element.evaluate(el => el.click());
}

export default click;