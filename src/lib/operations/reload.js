async function reload () {
    await this.curr_page.reload({ waitUntil: ['networkidle0', "domcontentloaded"] });
}

export default reload;