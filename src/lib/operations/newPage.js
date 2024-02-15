async function new_page ({ page_id }) {
   const newPage = await this.browser.newPage();
   this.pages.push({
      page: newPage,
      id: page_id
   })
   this.curr_page = newPage;
   this.logger.logEvent('operation_log', {
      message: `Page "${ page_id }" was instantiated.`,
      status_message: "info"
   });
}

export default new_page;