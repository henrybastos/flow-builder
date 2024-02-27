export async function screenshot ({ filename }) {
   await this.curr_page.screenshot({
      path: `static/${ filename }`
   });
}

export default screenshot;