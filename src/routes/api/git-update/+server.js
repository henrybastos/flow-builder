import { spawnSync, exec } from 'child_process';
import util from 'node:util';
const execProcess = util.promisify(exec);

export async function POST({ request }) {
   const { branch } = await request.json();

   let exitCode;
   let commandsOutput = [];

   function handlePromptSync(command, options) {
      const child = spawnSync(command.split(' ')[0], command.split(' ').slice(1), { ...options, shell: true }); // Separate command and arguments
      
      let result;

      if (child.stdout.toString()) {
         result = child.stdout.toString().trim();
         console.log('[STDOUT]', result);
         
      } else if (child.stderr.toString()) {
         result = child.stderr.toString().trim();
         console.error('[STDERR]', result);
      }

      return { output: result, status: child.status };
   }

   if (branch == 'dev_lab') {
      const cmdGitBranch = handlePromptSync(`git branch -v`);
      console.log(cmdGitBranch);
      exitCode = cmdGitBranch.status;
      commandsOutput.push({
         label: 'git_branch',
         output: cmdGitBranch.output,
         exit_code: cmdGitBranch.status
      });   
   }
   
   const cmdGitPullFlowBuilder = handlePromptSync(`git pull origin ${ branch }`);
   console.log(cmdGitPullFlowBuilder);
   exitCode = cmdGitPullFlowBuilder.status;
   commandsOutput.push({
      label: 'flow_builder_update',
      output: cmdGitPullFlowBuilder.output,
      exit_code: cmdGitPullFlowBuilder.status
   });
   
   const cmdCurrentWorkingDirectory = handlePromptSync('echo %cd%');
   const cmdGitPullFlowBlocks = handlePromptSync('git pull origin main', { cwd: `${cmdCurrentWorkingDirectory.output}/src/lib/flow-blocks` });
   console.log(cmdGitPullFlowBlocks);
   exitCode = cmdGitPullFlowBlocks.status;
   commandsOutput.push({
      label: 'flow_blocks_update',
      output: cmdGitPullFlowBlocks.output,
      exit_code: cmdGitPullFlowBlocks.status
   });
   
   return new Response(JSON.stringify({ status: exitCode == 0 ? 200 : 500, exitCode, commands_output: commandsOutput }));
}