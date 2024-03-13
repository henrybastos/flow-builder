<script>
   import * as Card from "$lib/components/ui/card";
   import * as Tabs from "$lib/components/ui/tabs";
   import Button from "$lib/components/ui/button/button.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import Textarea from "$lib/components/ui/textarea/textarea.svelte";
   import { getContext } from "svelte";

   const toast = getContext("toast");

   let tsvData;
   let jsonData;
   let responseTextarea;
   let inputFileOpener;
   let tsvFile;

   class CourseFormatter {
      static CONTENT_CSV;
      static LINES;
      static UGLY_DATE = new Date().toLocaleString().split(',')[0].split('/').reverse().join('-');
      static MODULE_TYPES = {
         selling: '1',
         welcome: '2',
         lesson: '3',
         bonus: '4'
      };

      static casefy = {
         titleCase: (str) => {
            return str
               .split(' ')
               .filter(v => v)
               .map(w => { 
                  w = w.toLowerCase(); 
                  return w.charAt(0).toUpperCase() + w.slice(1, w.length)
               })
               .join(' ');
         }
      }

      static configFormatter (tsd_data) {
         this.CONTENT_CSV = tsd_data;
         this.LINES = this.CONTENT_CSV.split('\n');
      }

      static _flag_removePlaylistFromLink = true;

      static modules = [];
      
      static isModule (_lesson_title) {
         return _lesson_title?.match(/(M(o|ó)dulo) \d+ [^\t]+/gi);
      }

      static isBonus (_lesson_title) {
         return _lesson_title?.match(/(B(o|ô)nus) \d+\s?[^\t]*/gi);
      }

      static extractLink(_str) {
         if (this._flag_removePlaylistFromLink) {
            return _str?.match(/https?\S*/g)?.map(link => link.replace(/&list.*/, '')) || ['', ''];
         }

         return _str?.match(/https?\S*/g) || ['', ''];
      }
      
      static isLesson (_line) {
         // return _title.match(/^(Aula|E-?book).*/g);
         // return _line.match(/^(B(o|ô)nus\s([0|00]?\d)\t)?(Aula|E-?book).*/g);
         return this.extractLink(_line)[0].length > 0 && _line?.match(/(Aula|(\s|\t|^)E-?book|(?<=\t)B(o|ô)nus)\s0?\d*[^\t]*/gi);
      }

      static genLesson ({ title, link, material = '' }) {
         return {
            lessons_id: {
               status: 'published',
               description: title,
               videoLink: link,
               supportMaterial: material
            }
         };
      }

      /**
       * 
       * @param {{ type: string, description: string, lessons: string[], details: string }} ModuleStrucuture
       * @returns An object with the module.
       */
      static genModule ({ type = '3', title = '', lessons, details = '' }) {
         return {
            modules_id: {
               moduleType: {
                  id: type
               },
               description: title,
               status: 'published',
               forecasting: this.UGLY_DATE,
               lessons,
               details
            }
         };
      }

      static getSellingVideoLine () {
         return this.LINES.filter(_line => _line.match(/V(í|i)deo de Vendas/g))[0].trim();
      }
      
      static genSellingVideoModule () {
         const [link, material] = this.extractLink(this.getSellingVideoLine());
         const sellingModuleLesson = this.genLesson({ 
            title: 'Vídeo de Vendas',
            link,
            material
         });
      
         return this.genModule({
            type: this.MODULE_TYPES.selling,
            title: 'Vídeo de Vendas',
            lessons: [
               sellingModuleLesson
            ]
         });
      }

      static getWelcomeVideoLine () {
         return this.LINES.filter(_line => _line.match(/Boas-Vindas/g))[0].trim();
      }

      static genWelcomeVideoModule () {
         const [link, material] = this.extractLink(this.getWelcomeVideoLine());
         const welcomeModuleLesson = this.genLesson({ 
            title: 'Boas-vindas',
            link,
            material
         });
      
         return this.genModule({
            type: this.MODULE_TYPES.welcome,
            title: 'Boas-vindas',
            lessons: [
               welcomeModuleLesson
            ]
         });
      }

      static genIntroModules () {
         return [
            this.genSellingVideoModule(),
            this.genWelcomeVideoModule()
         ];
      }

      static genAllModules () {
         let lessonsBuffer = [];
         let moduleBuffer;

         this.LINES.map((line, index) => {
            // Used to push the last module to the module list when is arrives at the last line.
            const isLastLine = index === this.LINES.length - 1;
            
            let [title] = this.isLesson(line.trim()) || this.isModule(line.trim()) || this.isBonus(line.trim()) || line.trim();
            let [link, material] = this.extractLink(line) || [null];

            if (this.isLesson(line.trim())) {
               // title = this.casefy.titleCase(title);
               lessonsBuffer.push(this.genLesson({ 
                  title, 
                  link,
                  material
               }));
               this.isModule(title)
               // console.log(`[LESSON]: ${  title } | ${ link }`);
            }

            if (this.isModule(title) || this.isBonus(title) || isLastLine) {
               // console.log('[MODULE]', title);           
               if (moduleBuffer) {    
                  this.modules.push(this.genModule({
                     type: this.isBonus(moduleBuffer.title) ? this.MODULE_TYPES.bonus : this.MODULE_TYPES.lesson,
                     title: moduleBuffer.title,
                     details: moduleBuffer.description,
                     lessons: lessonsBuffer
                  }));

                  lessonsBuffer = [];   
               }

               moduleBuffer = {
                  title,
                  description: this.LINES[index + 1]?.trim()
               };
            };
         }).filter(mod => mod);

         // return lessonsBuffer;
         return this.modules;
      }
   }

   function convertTsvData () {
      CourseFormatter.configFormatter(tsvData);

      try {
         jsonData = JSON.stringify([
            ...CourseFormatter.genIntroModules(), 
            ...CourseFormatter.genAllModules()
         ], null, 3)

         toast.success('Estrutura convertida.');
      } catch (err) {
         console.error(err);
         toast.error('Ocorreu um erro.');
      }
   }

   function copyJsonDataOutput () {
      if (navigator.clipboard && window.isSecureContext) {
            window.navigator.clipboard.writeText(jsonData);
        } else {
            console.warn(`Context is not secure (${ window.isSecureContext }). Using select and copy.`);
            responseTextarea.select();
            document.execCommand('copy')
        }
        
        toast.success('Saída copiada para a Área de Transferência!');
   }

   function importTsvFile (evt) {
      try {
         evt.target.files.item(0)
         let newFile = inputFileOpener.files[0];
         let reader = new FileReader();
         reader.readAsText(newFile, 'UTF-8');
         reader.onload = (evt) => {
            tsvFile = evt.target.result;
            tsvData = tsvFile;
         }
   
         toast.success(`Arquivo ${ newFile.name } importado com sucesso!`);
      } catch (err) {
         console.error(err);
         toast.error(`Não foi possível importar o arquivo ${ newFile.name }`);
      }
   }
</script>

<Card.Root class="mt-4 rounded-lg">
   <Card.Header>
      <Card.Title class="text-2xl font-bold">Conversor de Estrutura do Curso</Card.Title>
      <Card.Description class="text-base text-muted-foreground">
         Converte a estrutura de curso no formato .tsv para um .json aceito pelo Kronus.
      </Card.Description>
   </Card.Header>

   <Card.Content>
      <Tabs.Root value="tsv_data" class="w-full">
         <Tabs.List class="grid w-full grid-cols-2">
            <Tabs.Trigger value="tsv_data">Estrutura TSV</Tabs.Trigger>
            <Tabs.Trigger value="json_data">Estrutura JSON</Tabs.Trigger
            >
         </Tabs.List>

         <Tabs.Content value="tsv_data">
            <Label class="text-lg">Estrutura TSV</Label>
            <Textarea
               rows="12"
               class="resize-none mt-3 font-code text-base"
               bind:value={tsvData}
            />
            <input on:change={importTsvFile} bind:this={inputFileOpener} class="absolute opacity-0 left-36" type="file" accept="tsv" id="input-file-opener"/>

            <div class="flex flex-row gap-x-2 mt-4">
               <Button on:click={convertTsvData}>Converter</Button>
               <Button variant="secondary" on:click={() => inputFileOpener.click()}>Importar Arquivo TSV</Button>
           </div>
         </Tabs.Content>

         <Tabs.Content value="json_data">
            <Label class="text-lg">Estrutura JSON</Label>
            <textarea id="copy-only-field" bind:this={responseTextarea} class="absolute opacity-0">{ jsonData }</textarea>
            <Textarea
               rows="12"
               class="resize-none mt-3 font-code text-base"
               bind:value={jsonData}
            />

            <div class="flex flex-row gap-x-2 mt-4">
               <Button variant="default" on:click={copyJsonDataOutput}>Copiar saída</Button>
           </div>
         </Tabs.Content>
      </Tabs.Root>
   </Card.Content>
</Card.Root>