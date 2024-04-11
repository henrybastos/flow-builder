import ServerLogger from "./ServerLogger";
import { EnvHandler } from "$lib/EnvHandler";
import * as fbFuncs from "$lib/operations/_flowBuilderFuncs";

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
import new_page from "$lib/operations/newPage";
import select_page from "$lib/operations/selectPage";
import wait_for_element from "$lib/operations/waitForElement";
import check_element from "$lib/operations/checkElement";
import branch_eval from "$lib/operations/branchEval";
import screenshot from "$lib/operations/screenshot";
import wait_for_dom_render from "$lib/operations/waitForDomRender";
import { initStruct } from "$lib/PayloadStore";

/**
 * Comprise all Flow Builder Operations, like goto, scrape, eval etc.
 * 
 * #### Functions naming:
 * - _functionName: Internal puppeteer usage;
 * - functionName: Internal commom operations usage;
 * - function_name: Actual operation;
 */
export default class Operations {
    /** @type {Array<{ page: import('puppeteer').Page; }>} */
    static pages = [];
    static logger = ServerLogger;
    static logs = [];

    // static __flow_builder_are_funcs_injected__ = false;
    static _flowBuilderInjectionFuncs = {
        env: fbFuncs.env,
        env_query: fbFuncs.env_query,
        x: fbFuncs.x,
        xxx: fbFuncs.xxx,
        set_element_value: fbFuncs.set_element_value,
        wait_for_element: fbFuncs.wait_for_element,
        goto: fbFuncs.goto,
        download_blob: fbFuncs.download_blob,
        // download_yt_video: //fbFuncs.download_yt_video,
        async_eval: fbFuncs.async_eval
    }

    /**
     * Sets the page which the operation will work with.
     * @param {import('puppeteer').Page} _page 
     */
    static _setMainPage (_page) {
        /** @type {import('puppeteer').Page} */
        this.curr_page = _page;
        this.pages[0] = {
            id: 'main_page',
            page: _page
        };
        console.log('SET MAIN PAGE');
    }

    static _setBrowser (_browser) {
        /** @type {import('puppeteer').Browser} */
        this.browser = _browser;
    }

    static _setPayload (_payload) {
        this.payload = _payload;
        if (!this.payload.env?._$fb) { this.payload.env._$fb = initStruct; }
    }

    static async _injectFunctions () {
        if (!this.payload.env?._$fb) {
            console.log('[OPERATIONS] No _$fb env variable found.');
            console.log(this.payload.env);
        }
        
        // Initiates Flow Builder's internal variable $fb, exposed to the browser.
        if (!await this.curr_page.evaluate('try { _$fb } catch (err) { false }')) {
            console.log('FB does not exist', await this.curr_page.evaluate('try { _$fb } catch (err) { err.message }'));
            await this.curr_page.evaluate(`let _$fb = ${ JSON.stringify(this.payload.env?._$fb || {}) } ;`);
        }

        for (let [fn_name, fn_func] of Object.entries(this._flowBuilderInjectionFuncs)) {
            /** Tries to inject the function with a try-catch block, as the function might already be declared and defined. */
            if (!await this.curr_page.evaluate(`try { ${ fn_name } } catch (err) { false }`)) {
                console.log('[FUNC INJECTION]: Injecting function', fn_name);
                await this.curr_page.evaluate(`const ${ fn_name } = ${ fn_func }`);
            }
        }
    }

    static async getElement (_target, _timeout = 15000) {
        await this.wait_for_selector({ target: _target, timeout: _timeout });
        return await this.curr_page.$$(`xpath/${ _target }`);
    }

    static async runIterations (cb_flow, _operation, _env) {
        for (let i = 0; i < parseInt(_operation.iterations); i++) { 
            console.log(`[FLOW ITERATION ${i}] Running flow...`);

            this.payload.env._$fb.flow_iteration = i;
            await this.curr_page.evaluate(`_$fb.flow_iteration = ${ i };`);
            // this._replaceEnvPlaceholders(_operation, _env);

            await cb_flow(); 
        }
    }
    
    static check_element = check_element;
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
    static new_page = new_page;
    static select_page = select_page;
    static wait_for_element = wait_for_element;
    static eval_expression = eval_expression;
    static branch_eval = branch_eval;
    static screenshot = screenshot;
    static wait_for_dom_render = wait_for_dom_render;
}