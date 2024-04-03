async function reload () {
    this.logger.logEvent('operation_log', {
        message: `Reloading page.`,
        status_message: 'info'
    });

        await this.curr_page.reload({ waitUntil: ['networkidle0', "domcontentloaded"] });
}

export default reload;