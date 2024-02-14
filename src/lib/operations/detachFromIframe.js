async function detach_from_iframe () {
    console.log('PAGE TYPE', typeof this.curr_page);
    this.curr_page = this.curr_page.page();
    this.logger.logEvent('operation_log', {
        message: `The iFrame was detached.`,
        status_message: 'info'
    });
}

export default detach_from_iframe;