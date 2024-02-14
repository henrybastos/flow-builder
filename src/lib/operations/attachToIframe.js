async function attach_to_iframe ({ name }) {
    console.log('FRAMES', this.curr_page.frames());
    const frame = await this.curr_page.frames().find((frame) => frame.name().match(name) || frame.url().match(name));

    console.log('IFRAME', frame);
    this.curr_page = frame;
    this.logger.logEvent('operation_log', {
        message: `The iFrame ${ frame.url() } was set as the current page.`,
        status_message: 'info'
    });
}

export default attach_to_iframe;