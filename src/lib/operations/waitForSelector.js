async function wait_for_selector ({ target, timeout = 15000 }) {
    await this.curr_page.waitForSelector(`xpath/${ target }`, { timeout });

    this.logger.logEvent('operation_log', {
        message: `Waiting for element ${ target } has ended.`,
        status_message: "info"
    });
}

export default wait_for_selector;