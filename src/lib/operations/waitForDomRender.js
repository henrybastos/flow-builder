/**
* Code extracted from https://stackoverflow.com/questions/52497252/puppeteer-wait-until-page-is-completely-loaded
* by Anand Mahajan and Arel
* @param {import type { Page } from "puppeteer";} page 
* @param {number} timeout 
*/
async function wait_for_dom_render({ timeout = 15000 }) {
    const checkDurationMsecs = 1000;
    const maxChecks = timeout / checkDurationMsecs;
    let lastHTMLSize = 0;
    let checkCounts = 1;
    let countStableSizeIterations = 0;
    const minStableSizeIterations = 3;

    this.logger.logEvent("operation_log", {
        message: `Waiting for DOM changes...`,
        status_message: "info"
    })

    while (checkCounts++ <= maxChecks) {
        let html = await this.curr_page.content();
        let currentHTMLSize = html.length;

        let bodyHTMLSize = await this.curr_page.evaluate(() => document.body.innerHTML.length);

        console.log('[DOM LOADING] Last: ', lastHTMLSize, ' Curr: ', currentHTMLSize, " Body HTML size: ", bodyHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
            countStableSizeIterations++;
        else
            countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
            console.log("[DOM LOADING] Page rendered fully..");
            break;
        }

        lastHTMLSize = currentHTMLSize;
        await this.curr_page.waitForTimeout(checkDurationMsecs);
    }
}

export default wait_for_dom_render;