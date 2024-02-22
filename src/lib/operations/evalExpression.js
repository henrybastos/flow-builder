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

    // console.log('EVAL RESULT', expressionReturnValue);

    if (expressionReturnValue) {
        if (expressionReturnValue?._expose_key) {
            // Filters out the _expose_key
            const filteredObject = Object.fromEntries(
                Object.entries(structuredClone(expressionReturnValue)).filter(([ key, value ]) => key !== '_expose_key' && { [key]: value })
            );

            // Adding the _expose_key object, exposes the expressionReturnValue to the browser to be used with eval_expression;
            const exposeEvalExpression = `const ${ expressionReturnValue?._expose_key } = ${ JSON.stringify(filteredObject) }`;
            await this.curr_page.evaluate(exposeEvalExpression);
            await this.curr_page.evaluate(`console.log("[FB_SYS] Exposed key: ${expressionReturnValue?._expose_key}")`);
            console.log(exposeEvalExpression);
            expressionReturnValue = filteredObject;
        }

        if (expressionReturnValue?.error) {
            this.logger.logEvent("operation_log", {
                message: `[EVAL EXECPTION]: ${ expressionReturnValue.error }`,
                status_message: "error"
            })

            return expressionReturnValue;
        } 

        let logMessage;
        
        if (typeof expressionReturnValue === 'object') {
            logMessage = JSON.stringify(expressionReturnValue);
        } else if (['string', 'number', 'boolean'].includes(typeof expressionReturnValue)) { 
            logMessage = expressionReturnValue.toString();
            expressionReturnValue = { [`AUTO_${ Math.random().toString().slice(3, 12) }`]: expressionReturnValue }
        } 

        this.logger.logEvent("operation_log", {
            message: `Expression result: ${ logMessage.toString().slice(0, 100) }`,
            status_message: "info"
        })

        // console.log('RESPONSE ALL', logMessage);

        // if (logMessage.length > 20000) {
        //     const bufferArray = logMessage.match(/.{20000}/g);
        //     const resBuffer = {
        //         chunks: bufferArray, 
        //         ...(
        //             bufferArray.join('').length !== logMessage.length && 
        //             {last_chunk: logMessage.slice(bufferArray.join('').length - logMessage.length)}
        //         )
        //     }

        //     for (let chunk of [...resBuffer.chunks, resBuffer.last_chunk]) {
        //         this.logger.logEvent("response_chunk", {
        //             message: chunk,
        //             status_message: "info"
        //         })
        //     }
        // } else {
        //     this.logger.logEvent("response", {
        //         message: logMessage,
        //         status_message: "info"
        //     })
        // }

        console.log('expressionReturnValue', expressionReturnValue);
        return expressionReturnValue;
    }
}

export default eval_expression;