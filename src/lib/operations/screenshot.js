export async function screenshot ({ filename }) {
   await this.curr_page.screenshot({
      path: `static/${ filename || `screenshot-${ Math.random().toString().slice(2,10) }` }`
   });
}

export default screenshot;