import ServerLogger from "./ServerLogger"
import { 
    x, 
    xxx, 
    goto as goto_fn, 
    download_blob, 
    download_yt_video
} from "$lib/operations/_flowBuilderFuncs";
import scrape_attr from "$lib/operations/scrapeAttribute";
import goto from "$lib/operations/goto";
import wait_for_selector from "$lib/operations/waitForSelector";
import user_click from "$lib/operations/userClick";
import click from "$lib/operations/click";
import keyboard_type from "$lib/operations/keyboardType";
import select_option from "$lib/operations/selectOption";
import scrape_multiple_attr from "$lib/operations/scrapeMultipleAttributes";
import set_attr from "$lib/operations/setAttribute";
import set_env from "$lib/operations/setEnv";
import eval_regex from "$lib/operations/evalRegex";
import reload from "$lib/operations/reload";
import press_key from "$lib/operations/pressKey";
import wait_for_navigation from "$lib/operations/waitForNavigation";
import combo_keys from "$lib/operations/comboKeys";
import wait_seconds from "$lib/operations/waitSeconds";
import set_payload_slot from "$lib/operations/setPayloadSlot";
import close_browser from "$lib/operations/closeBrowser";
import extract_param_from_url from "$lib/operations/extractParamFromUrl";
import extract_route_from_url from "$lib/operations/extractRouteFromUrl";
import download_image from "$lib/operations/downloadImage";
import detach_from_iframe from "$lib/operations/detachFromIframe";
import attach_to_iframe from "$lib/operations/attachToIframe";
import eval_expression from "$lib/operations/evalExpression";
import chrome_picker_set_color from "$lib/operations/chromePickerSetColor";

/**
 * Comprise all Flow Builder Operations, like goto, scrape, eval etc.
 * 
 * #### Functions naming:
 * - _functionName: Internal puppeteer usage;
 * - functionName: Internal commom operations usage;
 * - function_name: Actual operation;
 */
export default class Operations {
    static pages = [];
    static logger = ServerLogger;

    // static __flow_builder_are_funcs_injected__ = false;
    static _flowBuilderInjectionFuncs = {
        x: x,
        xxx: xxx,
        goto: goto_fn,
        download_blob: download_blob,
        download_yt_video: download_yt_video
    }

    /**
     * Sets the page which the operation will work with.
     * @param {import('puppeteer').Page} _page 
     */
    static _setPage (_page) {
        this.curr_page = _page;
        console.log('SET PAGE');
    }

    static _setBrowser (_browser) {
        this.browser = _browser;
    }

    static _setPayload (_payload) {
        this.payload = _payload;
    }

    static async _injectFunctions () {
        for (let [fn_name, fn_func] of Object.entries(this._flowBuilderInjectionFuncs)) {
            /** Tries to inject the function with a try-catch block, as the function might already be declared and defined. */
            if (!await this.curr_page.evaluate(`try { ${ fn_name } } catch (err) { false }`)) {
                console.log('[FUNC INJECTION]: Injecting function', fn_name);
                // console.log(`[FUNC] ${fn_name} :: const ${ fn_name } = ${ fn_func }`);
                /** Injects the functions into the page, so it can be used with evaluate */
                await this.curr_page.evaluate(`const ${ fn_name } = ${ fn_func }`);
            }
        }
    }

    /**
        * Code extracted from https://stackoverflow.com/questions/52497252/puppeteer-wait-until-page-is-completely-loaded
        * by Anand Mahajan and Arel
        * @param {import type { Page } from "puppeteer";} page 
        * @param {number} timeout 
        */
    static async waitTillHTMLRendered (page, timeout = 30000) {
        const checkDurationMsecs = 1000;
        const maxChecks = timeout / checkDurationMsecs;
        let lastHTMLSize = 0;
        let checkCounts = 1;
        let countStableSizeIterations = 0;
        const minStableSizeIterations = 3;
        
        while(checkCounts++ <= maxChecks){
            let html = await page.content();
            let currentHTMLSize = html.length; 
        
            let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);
        
            console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
        
            if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
            countStableSizeIterations++;
            else 
            countStableSizeIterations = 0; //reset the counter
        
            if(countStableSizeIterations >= minStableSizeIterations) {
            console.log("Page rendered fully..");
            break;
            }
        
            lastHTMLSize = currentHTMLSize;
            await page.waitForTimeout(checkDurationMsecs);
        }  
    };

    static async getElement (_target) {
        await this.wait_for_selector({ target: _target, timeout: this.payload?.wait_timeout });
        return await this.curr_page.$$(`xpath/${ _target }`);
    }

    /**
     * @param {{ target: string, success_flow: string, error_flow: string }} operation 
     * @returns The name of the flow (success or error).
     */
    static async checkElement ({ target, success_flow, error_flow }) {
        console.log('CHECK.FLOWS', target, success_flow, error_flow);
        try {
            await this.getElement(target);
            console.log(`Running flow: ${ success_flow }`);
            return success_flow;
        } catch (err) {
            console.log(err);
            console.log(`Running flow: ${ error_flow }`);
            return error_flow;
        }
    }

    static goto = goto;
    static scrape_attr = scrape_attr;
    static wait_for_selector = wait_for_selector;
    static user_click = user_click;
    static click = click;
    static keyboard_type = keyboard_type;
    static select_option = select_option;
    static scrape_multiple_attr = scrape_multiple_attr;
    static set_attr = set_attr;
    static set_env = set_env;
    static eval_regex = eval_regex;
    static chrome_picker_set_color = chrome_picker_set_color;
    static wait_for_navigation = wait_for_navigation;
    static reload = reload;
    static press_key = press_key;
    static combo_keys = combo_keys;
    static wait_seconds = wait_seconds;
    static set_payload_slot = set_payload_slot;
    static close_browser = close_browser;
    static extract_param_from_url = extract_param_from_url;
    static extract_route_from_url = extract_route_from_url;
    static download_image = download_image;
    static attach_to_iframe = attach_to_iframe;
    static detach_from_iframe = detach_from_iframe;
    static eval_expression = eval_expression;
}