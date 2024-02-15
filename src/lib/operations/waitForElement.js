let attempts_limit = 5;

async function wait_for_element ({ target, timeout }) {
   for (let i = 0; i < attempts_limit; i++) {
      console.log(`Attempt ${ i } of ${attempts_limit}`);
      try {
         await this.wait_for_selector({ target, timeout });
         const element = await this.curr_page.$$(`xpath/${ target }`)
         console.log('Found!');
         console.log(element);
         if (element) { return element; }
      } catch (err) {
         console.log('Not found. Attempting again');
      }
      // return element.innerText;
   }

   console.log('end');
}

export default wait_for_element;