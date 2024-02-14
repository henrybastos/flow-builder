/**
 * Evaluate Expression
 * @returns If an object is returned, it is forward to the Response Payload accordingly.
 */
async function eval_expression ({ expression }) {
    await this._injectFunctions();

    this.logger.logEvent("operation_log", {
        message: `Waiting for DOM changes...`,
        status_message: "info"
    })
    await this.waitTillHTMLRendered(await this.curr_page, 5000);

    this.logger.logEvent("operation_log", {
        message: `Evaluating expression: ${ expression }`,
        status_message: "info"
    })

    let expressionReturnValue = await this.curr_page.evaluate(expression);

    this.logger.logEvent("operation_log", {
        message: `Expression return value: ${ expressionReturnValue }`,
        status_message: "info"
    })

    console.log('Expression return value:', expressionReturnValue);

    // if (typeof expressionReturnValue === 'object') { expressionReturnValue = JSON.stringify(expressionReturnValue) }
    
    return expressionReturnValue || 'Invalid expression return value.';
}

export default eval_expression;