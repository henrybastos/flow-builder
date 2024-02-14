async function press_key ({ key }) {
    this.logger.logEvent('operation_log', {
        message: `Pressing key: ${ key }`,
        status_message: 'info'
    });

    await this.curr_page.keyboard.press(key);
}

export default press_key;