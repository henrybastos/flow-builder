async function select_page ({ page_id }) {
   // TESTME:
   const targetPage = page_id === 'main_page' ? 'main_page' :  this.pages.find(({ id }) => id === page_id);
   
   if (targetPage) {
      this.logger.logEvent('operation_log', {
         message: `Page "${ page_id }" selected.`,
         status_message: "info"
      });
      this.curr_page = targetPage.page;
   } else {
      this.logger.logEvent('operation_log', {
         message: `Page "${ page_id }" not found.`,
         status_message: "error"
      });
      console.error(`[ERROR] Invalid page with page id: ${ page_id }`);
   }
}

export default select_page;