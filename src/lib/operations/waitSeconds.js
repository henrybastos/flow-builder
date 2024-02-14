async function wait_seconds ({ time }) {
    this.logger.logEvent("operation_log", {
        message: `Waiting ${ time } ms...`,
        status_message: "info"
    });

    return await new Promise((res) => {
        setTimeout(res, time);
    });
}

export default wait_seconds;