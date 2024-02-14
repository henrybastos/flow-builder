async function chrome_picker_set_color ({ trigger_target, picker_target, color }) {
    await this.click({ target: trigger_target });
    await this.click({ target: picker_target }, 'user');
    await this.select_option({ target: picker_target });
    await this.keyboard_type({ target: picker_target, value: color });
}

export default chrome_picker_set_color;