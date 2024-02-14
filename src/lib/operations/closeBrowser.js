async function close_browser () {
    this.logger.logEvent("operation_log", {
        message: 'Closing browser...',
        status_message: "info"
    });
    
    console.log('Closing browser...');

    await this.browser.close();
}

export default close_browser;