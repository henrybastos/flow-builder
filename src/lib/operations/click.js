async function click ({ target }) {
    const [element] = await this.getElement(target);

    this.logger.logEvent('operation_log', {
        message: `Clicking element: ${ target }`,
        status_message: 'info'
    });

    try {
        await element.evaluate(el => el.click());
    } catch (err) {
        console.error(err);
    }
}

export default click;