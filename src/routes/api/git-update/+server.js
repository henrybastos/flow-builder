import { spawnSync, exec } from 'child_process';
import util from 'node:util';
const execProcess = util.promisify(exec);

export async function GET() {
   // const { scope } = await request.json();
   // console.log(scope);
   let exitCode;
   let output;

   // async function execTypedCommand(command) {
   //    try {
   //       const { stdout, stderr } = await execProcess(command);
   //       return stdout ? { stdout } : { stderr };
   //    } catch (error) {
   //       console.log('[ERROR]', error.message);
   //       return { error }
   //    }
   // }

   // function handlePrompt(command, options) {
   //    const child = spawn(command.split(' ')[0], command.split(' ').slice(1), { ...options, shell: true }); // Separate command and arguments
   //    let result;

   //    child.stdout.on('data', (data) => {
   //       result = data.toString().trim();
   //       console.log('[STDOUT]', result);
   //       return result;
   //    });

   //    child.stderr.on('data', (data) => {
   //       result = data.toString().trim();
   //       console.error('[STDERR]', result);
   //       return result;
   //    });

   //    child.on('exit', (code) => {
   //       console.log(`[EXIT CODE] ${code}`);
   //       exitCode = code;
   //    });
   // }

   function handlePromptSync(command, options) {
      const child = spawnSync(command.split(' ')[0], command.split(' ').slice(1), { ...options, shell: true }); // Separate command and arguments
      
      let result;

      if (child.stdout) {
         result = child.stdout.toString().trim();
         console.log('[STDOUT]', result);
         
      } else if (child.stderr) {
         result = child.stderr.toString().trim();
         console.error('[STDERR]', result);
      }

      return { output: result, status: child.status };

      // child.on('exit', (code) => {
      //    console.log(`[EXIT CODE] ${code}`);
      //    exitCode = code;
      // });
   }

   // async function waitForExit () {
   //    const hasExited = await new Promise((res) => {
   //       setTimeout(() => {
   //          res(!(exitCode === undefined));
   //       }, 200);
   //    });

   //    // console.log('[HAS EXITED?] ', hasExited);
   //    if (!hasExited) { await waitForExit() };
   // }

   // handlePrompt('git remote -v');
   // handlePrompt('git config --local --list');
   // handlePrompt('git pull origin dev_lab', 'Kbk@1234');
   // handlePrompt('git remote -v');

   // exitCode = handlePromptSync('git remote -v').status;
   
   let gitPullCmd = handlePromptSync('git pull origin main');
   exitCode = gitPullCmd.status;
   output = gitPullCmd.output;
   console.log(gitPullCmd);
   
   const cwdCmd = handlePromptSync('echo %cd%');
   gitPullCmd = handlePromptSync('git pull origin main', { cwd: `${cwdCmd.output}/src/lib/flow-blocks` });
   exitCode = gitPullCmd.status
   output = gitPullCmd.output;
   console.log(gitPullCmd);
   
   // if (scope === 'flow-builder') {
   // } else if (scope === 'flow-blocks') {
   //    // console.log(`${cwd.output}/src/lib/flow-blocks`);
   //    // const result = handlePromptSync('echo %cd%');
   //    // const result = handlePromptSync('cmatrix');
   //    // exitCode = result.status
   //    // console.log(cwd);

   //    // console.log('[CWD]', cwd);
   //    // handlePrompt('cd ./src/lib/flow-blocks');
   //    // handlePrompt('git remote -v');
   //    // handlePrompt('git pull origin main');
   // }
   
   // await waitForExit();
   return new Response(JSON.stringify({ status: exitCode == 0 ? 200 : 500, exitCode, output }));

   // await execTypedCommand('echo %cd%');
   // console.log(await execTypedCommand('echo %cd%'));
   // console.log(await execTypedCommand('git status'));
   // console.log(await execTypedCommand('git remote -v'));
   // console.log(await execTypedCommand('git pull origin dev_lab'));
   // console.log(await execTypedCommand(`git -c credential.helper='!f() { echo "password=Kbk@1234"; }; f' git pull origin dev_lab`));
   // console.log(await execTypedCommand('ssh-add -L'));
}