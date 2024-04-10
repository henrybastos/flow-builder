import { exec } from 'child_process';
import util from 'node:util';
const execProcess = util.promisify(exec);

export async function POST({ request }) {
   const { collection, config } = await request.json();

   function genUppercasedFilename(str) {
      return str.toUpperCase().match(/[^\s-_\/]*/g).filter(v => v).join('_') + '.mp4';
   }

   async function execTypedCommand(command) {
      try {
         const { stdout, stderr } = await execProcess(command);
         return stdout ? { stdout } : { stderr };
      } catch (error) {
         console.log('[ERROR]', error.message);
         return { error }
      }
   }

   async function downloadCollection() {
      for (let [module_index, module] of Object.entries(JSON.parse(collection))) {
         for (let lesson of module.module_lessons) {
            let filename = `MOD_${(module_index + 1).toString().padStart(2, '0')}_${genUppercasedFilename(lesson.lesson_title)}`
            let command = `yt-dlp "${lesson.lesson_link}" -o "${config?.destination_folder || '~/downloads/Flow Builder Video Downloads'}/${filename}" -f "mp4" -S "res:720,fps"`
            console.log('[RUNNING COMMAND] :: ', command);
            const videoStatus = await execTypedCommand(command);
            console.log('[VIDEO STATUS]', videoStatus);
         }
      }
   }

   function handleOutput(output, handler) {
      if (output?.error) {
         swtichCases(output.error.stderr, handler.errors, () => {
            handler.stderr.action(output.error.stderr);
         })
      } else {
         handler.stdout.action(output.stdout)
         // console.log(`${ handler.stdout } // ${ output.stdout }`);
      }
   }

   function swtichCases(result, cases, default_action) {
      for (let case_opt of cases) {
         const regexMatch = new RegExp(`${case_opt.name}`, 'g');

         if (result.match(regexMatch)) {
            case_opt.action();
            return;
         }
      }

      default_action();
   }

   async function checkYTDLP() {
      let downloaderStatus = null;
      const checkYTDLP = await execTypedCommand('yt-dlp --version');

      handleOutput(checkYTDLP, {
         stderr: {
            action: () => downloaderStatus = '200'
         },
         stdout: {
            action: () => downloaderStatus = '200'
         },
         errors: [
            {
               name: 'n�o � reconhecido como um comando interno',
               action: () => {
                  downloaderStatus = '404';
                  console.log('[ERROR] // Comando não reconhecido.')
               }
            }
         ]
      })

      return downloaderStatus;
   }

   const YTDLPStatus = await checkYTDLP();

   if (YTDLPStatus !== '200') {
      return new Response(JSON.stringify({
         status: YTDLPStatus,
         message: `YT DLP might not be installed. Status code: ${ YTDLPStatus }`
      }));
   }

   const collectionStatus = await downloadCollection();
   console.log('[COLLECTION STATUS]', collectionStatus);

   return new Response(JSON.stringify({
      status: 200,
      message: `Videos downloaded at /${config?.destination_folder || 'videos'} folder.`
   }));
}

