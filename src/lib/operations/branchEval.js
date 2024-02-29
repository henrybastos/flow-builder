async function branch_eval ({ expression, success_flow, error_flow }) {
   const result = await this.eval_expression({ expression });
   console.log('[BRANCH EVAL RESULT]', result);
   if (!result || result?.error) { return error_flow }
   return success_flow;
}

export default branch_eval;