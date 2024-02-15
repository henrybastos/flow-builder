/**
     * @param {{ target: string, success_flow: string, error_flow: string }} operation 
     * @returns The name of the flow (success or error).
     */
async function check_element ({ target, success_flow, error_flow }) {
   try {
       await this.getElement(target);
       console.log(`Running success flow: ${ success_flow }`);
       return success_flow;
   } catch (err) {
       console.log(err);
       console.log(`Running error flow: ${ error_flow }`);
       return error_flow;
   }
}

export default check_element;