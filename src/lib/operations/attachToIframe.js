const DEBUG_FRAMES = false;

async function attach_to_iframe ({ xpath }) {
    await this.curr_page.waitForSelector(`xpath/${ xpath }`, { timeout: 5000 });
    const iframeElement = await this.curr_page.$(`xpath/${ xpath }`);
    
    if (iframeElement) {
        const iframeElementContent = await iframeElement.contentFrame();
        this.curr_page = iframeElementContent;
        // console.log('IFRAME CONTENT', await this.curr_page.content());

        this.logger.logEvent('operation_log', {
            message: `The iFrame ${ xpath } was set as the current page.`,
            status_message: 'info'
        });
    } else {
        this.logger.logEvent('operation_log', {
            message: `No iFrame found: ${ xpath }`,
            status_message: 'error'
        });
    }
}

export default attach_to_iframe;