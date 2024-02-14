async function user_click ({ target }) {
    const [element] = await this.getElement(target);

    this.logger.logEvent('operation_log', {
        message: `User clicking element: ${ target }`,
        status_message: 'info'
    });

    await element.click();

    // Needs inspecition
    // for (let i = count; i > 0; i--) {
    // }
}

export default user_click;