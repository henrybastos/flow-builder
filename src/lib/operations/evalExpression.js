import { removeKeyFlags, fillUndefinedQueryMembers } from "../../routes/api/run-flow/operationUtils";

/**
 * Evaluate Expression
 * @returns If an object is returned, it is forward to the Response Payload accordingly.
 */
async function eval_expression ({ expression }) {
    // await this._injectFunctions();
    // await this.wait_for_dom_render(await this.curr_page, 5000);
    
    // const gotoFBI = () => { window.location.href = 'https://www.fbi.gov/' };// await this.curr_page.evaluate(`if (try { gotoFBI } catch (err) {false}) { const gotoFBI = ${gotoFBI}; };`);
    // await this.curr_page.exposeFunction('gotoFBI', gotoFBI );
    // await this.curr_page.evaluate(`gotoFBI()`);

    let expressionResult = await this.curr_page.evaluate(expression);

    this.logger.logEvent("operation_log", {
        message: `Evaluating expression: ${ expression }`,
        status_message: "info"
    })

    console.log('EVAL RESULT', expressionResult);

    if (expressionResult) {
        for (let [key, value] of Object.entries(expressionResult)) {
            const exposed = key.match(/@expose:/g);
            const query = key.match(/@query:/g);

            key = removeKeyFlags(key);

            if (exposed) {
                if (query) {
                    const fb = await this.curr_page.evaluate('_$fb');
                    fillUndefinedQueryMembers(key, fb);
                    eval(`fb.${key} = value`);
                    await this.curr_page.evaluate((fb) => {_$fb = fb}, fb);
                } else {
                    await this.curr_page.evaluate((result) => {_$fb = { ..._$fb, ...(result)}}, { [key]: value });
                }
                
                await this.curr_page.evaluate(`console.log("[FLOW BUILDER] Exposed key: ${ key }")`);
            }
        }
        
        console.log('_$fb:', await this.curr_page.evaluate('_$fb'));
        // if (flags.exposed) {
            // Filters out the _expose_key
            // const filteredObject = Object.fromEntries(
            //     Object.entries(structuredClone(expressionResult)).filter(([ key, value ]) => key !== '_expose_key' && { [key]: value })
            // );

            // Adding the _expose_key object, exposes the expressionResult to the browser to be used with eval_expression;
            // if (!await this.curr_page.evaluate(`try { ${ expressionResult?._expose_key } } catch (err) { false }`)) {
            // }
            // await this.curr_page.evaluate(`_$fb = { ..._$fb, ...(${ JSON.stringify(filteredObject)}) }`);
            // await this.curr_page.evaluate(`console.log("[FB_SYS] Exposed key: ${expressionResult}")`);
        // }

        if (expressionResult?.error) {
            this.logger.logEvent("operation_log", {
                message: `[EVAL EXECPTION]: ${ expressionResult.error }`,
                status_message: "error"
            })

            return expressionResult;
        } else if (expressionResult?.warning) {
            this.logger.logEvent("operation_log", {
                message: `[EVAL WARNING]: ${ expressionResult.warning }`,
                status_message: "warning"
            })

            return expressionResult;
        } 

        let logMessage;
        
        if (typeof expressionResult === 'object') {
            logMessage = JSON.stringify(expressionResult);
        } else if (['string', 'number', 'boolean'].includes(typeof expressionResult)) { 
            logMessage = expressionResult.toString();
            expressionResult = { [`@private:AUTO_${ Math.random().toString().slice(3, 12) }`]: expressionResult }
        } 

        this.logger.logEvent("operation_log", {
            message: `Expression result: ${ logMessage.toString().slice(0, 100) }`,
            status_message: "info"
        })

        console.log('[EVAL EXPRESSION] Result: ', expressionResult);
        return expressionResult;
    }
}

export default eval_expression;