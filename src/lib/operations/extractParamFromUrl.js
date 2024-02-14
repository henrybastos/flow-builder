async function extract_param_from_url ({ param }) {
    this.logger.logEvent('operation_log', {
        message: `Retrieving parameter  ${ param }...`,
        status_message: 'info'
    });
    
    const urlSearchParams = new URLSearchParams(await this.curr_page.evaluate(() => window.location.search));
    return urlSearchParams.get(param);
}

export default extract_param_from_url