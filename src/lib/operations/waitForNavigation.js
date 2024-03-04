async function wait_for_navigation () {
    try {
        this.logger.logEvent('operation_log', {
            message: `Waiting for navigation...`,
            status_message: 'info'
        });
        await this.curr_page.waitForNavigation();
    } catch (err) {
        this.logger.logEvent('operation_log', {
            message: `Failed to wait for navigation`,
            status_message: 'warning'
        });
    }
}

export default wait_for_navigation;