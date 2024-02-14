async function eval_regex ({ target, regex }) {
    const [element] = await this.getElement(target);
    return await element.evaluate((dom_el, _regex) => dom_el.value.match(new RegExp(_regex, 'g')), regex);
}

export default eval_regex;