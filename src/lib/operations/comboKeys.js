/**
 * Press multiple keys in combo.
 * @param {import('puppeteer').Page} _page 
 * @param {string[]} _keys 
 * @param {string[]} _mod_keys
 */
export default async function (_page, _keys, _mod_keys) {
    for(const key of _mod_keys) {
        await _page.keyboard.down(key);
    }
    
    for(const key of _keys) {
        await _page.keyboard.press(key);
    }
    
    for(const key of _mod_keys) {
        await _page.keyboard.up(key);
    }
}