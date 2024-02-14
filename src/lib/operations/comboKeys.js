/**
 * Press multiple keys in combo.
 * @param {{ keys: Array<string>, mod_keys: Array<string> }} operation_params
 */
async function combo_keys ({ keys, mod_keys }) {
    this.logger.logEvent('operation_log', {
        message: `Pressing combo keys: ${ keys.join(', ') } + ${ mod_keys.join(', ') }`,
        status_message: "info"
    });

    for(const key of mod_keys) {
        await this.curr_page.keyboard.down(key);
    }
    
    for(const key of keys) {
        await this.curr_page.keyboard.press(key);
    }
    
    for(const key of mod_keys) {
        await this.curr_page.keyboard.up(key);
    }
}

export default combo_keys;