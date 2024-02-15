async function branch_eval ({ expression, success_flow, error_flow }) {
   const result = await this.eval_expression({ expression });
   console.log('RESULT', result);
   if (result) { return success_flow }
   return error_flow;
}

export default branch_eval;