async function goto({ target }) {
    this.logger.logEvent('operation_log', {
        message: `Navigating to: ${ target }`,
        status_message: 'info'
    });
    
    try {
        await this.curr_page.goto(target, { waitUntil: 'networkidle0' });
    } catch (err) {
        console.error(err);
        this.logger.logEvent('error', {
            message: `${ err.name } :: ${ err.message }`,
            status_message: 'error'
        });
    }
}

export default goto;