async function goto({ target }) {
    this.logger.logEvent('operation_log', {
        message: `Navigating to: ${ target }`,
        status_message: 'info'
    });
    
    await this.curr_page.goto(target, { waitUntil: 'networkidle0' });
}

export default goto;