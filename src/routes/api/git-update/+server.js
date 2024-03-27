import { spawn, exec } from 'child_process';
import util from 'node:util';
const execProcess = util.promisify(exec);

export async function GET() {
   let exitCode;

   async function execTypedCommand(command) {
      try {
         const { stdout, stderr } = await execProcess(command);
         return stdout ? { stdout } : { stderr };
      } catch (error) {
         console.log('[ERROR]', error.message);
         return { error }
      }
   }

   function handlePrompt(command, input) {
      const child = spawn(command.split(' ')[0], command.split(' ').slice(1)); // Separate command and arguments

      // if (input) {
         // child.stdin.write(input); // Replace with actual user input handling
         // child.stdin.end();
         // child.stdout.pipe(spawn('Kbk@1234', [], { shell: true }).stdin);
      // }

      child.stdout.on('data', (data) => {
         console.log(data.toString());
      });

      child.stderr.on('data', (data) => {
         console.error(data.toString());
      });

      child.on('exit', (code) => {
         console.log(`[EXIT CODE] ${code}`);
         exitCode = code;
      });
   }

   async function waitForExit () {
      const hasExited = await new Promise((res) => {
         setTimeout(() => {
            res(exitCode === undefined ? false : true);
         }, 200);
      });

      // console.log('[HAS EXITED?] ', hasExited);
      if (!hasExited) { await waitForExit() };
   }

   // handlePrompt('git remote -v');
   // handlePrompt('git config --local --list');
   // handlePrompt('git pull origin dev_lab', 'Kbk@1234');
   // handlePrompt('git remote -v');
   handlePrompt('git pull origin main');
   
   await waitForExit();
   return new Response(JSON.stringify({ status: exitCode == 0 ? 200 : 500, exitCode }));

   // await execTypedCommand('echo %cd%');
   // console.log(await execTypedCommand('echo %cd%'));
   // console.log(await execTypedCommand('git status'));
   // console.log(await execTypedCommand('git remote -v'));
   // console.log(await execTypedCommand('git pull origin dev_lab'));
   // console.log(await execTypedCommand(`git -c credential.helper='!f() { echo "password=Kbk@1234"; }; f' git pull origin dev_lab`));
   // console.log(await execTypedCommand('ssh-add -L'));
}