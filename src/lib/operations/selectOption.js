async function select_option ({ target }) {
    const [element] = await this.getElement(target);
    return await element.evaluate(dom_el => dom_el.select());
}

export default select_option;