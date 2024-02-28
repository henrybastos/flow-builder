async function goto({ target }) {
    this.logger.logEvent('operation_log', {
        message: `Navigating to: ${ target }`,
        status_message: 'info'
    });
    
    try {
        let status = await this.curr_page.goto(target, { waitUntil: 'networkidle0' });
        if (status) { status = status.status() };
        // console.log('[NAVIGATION STATUS]', status);
    } catch (err) {
        console.error(err);
        this.logger.logEvent('error', {
            message: `${ err.name } :: ${ err.message }`,
            status_message: 'error'
        });
    }
}

export default goto;