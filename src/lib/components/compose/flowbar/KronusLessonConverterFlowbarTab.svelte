<script>
   import * as Card from "$lib/components/ui/card";
   import * as Tabs from "$lib/components/ui/tabs";
   import Button from "$lib/components/ui/button/button.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import Textarea from "$lib/components/ui/textarea/textarea.svelte";
   import { getContext } from "svelte";

   let modulesIndex = 0;
   let kronusPayload = '';
   let flowComposerPayload = '';
   const toast = getContext('toast');

   const INCLUDE_MODULE_DAYS_LOCKED = false;

   // Appends a prefix "Aula XX" to the lesson name
   const APPEND_LESSON_PREFIX = true;

   // Appends a prefix "Módulo XX" to the module name
   const APPEND_MODULE_PREFIX = true;

   // Removes the playlist parameter from YouTube video links
   const REMOVE_PLAYLIST = true;

   // Removes characters unsupported by file systems
   // NOTE: Disabling this might break some filenames if used with yt-dlp downloader
   const CLEAN_FILE_NAME = true;

   function checkSellingOrWelcomeVideo (title) {
      return title.match(/P(á|a)gina de Vendas/gi) || title.match(/Boas(-|\s)Vindas/gi);
   }

   function pipeLesson (title, index, max) {
      if (!APPEND_LESSON_PREFIX || checkSellingOrWelcomeVideo(title)) { return title; }
      if (!CLEAN_FILE_NAME) { return `Aula ${ (index + 1).toString().padStart(max > 100 ? 3 : 2, '0') } - ${ title }` }

      return cleanTitle(`Aula ${ (index + 1).toString().padStart(max > 100 ? 3 : 2, '0') } - ${ title }`);
   }

   function pipeModule (title, max) {
      if (!APPEND_MODULE_PREFIX || checkSellingOrWelcomeVideo(title)) { return title; }
      modulesIndex++;
      if (!CLEAN_FILE_NAME) { return `Módulo ${ modulesIndex } - ${ title }` }

      return cleanTitle(`Módulo ${ modulesIndex } - ${ title }`);
   }

   function pipeLink (link) {
      if (REMOVE_PLAYLIST) { 
         return link.match(/.*(?=&list=)/gi)?.[0] || link; 
      }
      return link;
   }

   function cleanTitle (_title) {
      return _title.match(/[^\\/\:\*\?\<\>\|!@#$%¨&]/gi).join('')
   }

   function getModulesAndLessons (payload) {
      return payload.map((module, _, mod_array) => ({
         module_title: pipeModule(module.modules_id.description.trim(), mod_array.length),
         module_lessons: module.modules_id.lessons.map((lesson, lesson_index, lesson_array) => ({
               lesson_title: pipeLesson(lesson.lessons_id.description.trim(), lesson_index, lesson_array.length),
               lesson_link: pipeLink(lesson.lessons_id.videoLink)
         })),
         ...(INCLUDE_MODULE_DAYS_LOCKED && { module_days_locked: "" })
      }));
   }

   function convertKronusPayload () {
      try {
         const convertedOutput = getModulesAndLessons(JSON.parse(kronusPayload));
         flowComposerPayload = JSON.stringify(convertedOutput, null, 3);
         toast.success('Dados convertidos!');
         console.log('Writing done!');
      } catch (err) {
         toast.error('Ocorreu um erro...');
         console.error('[ERROR] Something went wrong: ', err);
      }
   }
</script>

<Card.Root class="mt-4 rounded-lg">
   <Card.Header>
      <Card.Title class="text-2xl font-bold">Conversor de Aulas Kronus</Card.Title>
      <Card.Description class="text-base text-muted-foreground">Converte aulas do Kronus para um formato aceitado pelo Flow Builder.</Card.Description>
   </Card.Header>

   <Card.Content>
      <Tabs.Root value="kronus_data" class="w-full">
         <Tabs.List class="grid w-full grid-cols-2">
            <Tabs.Trigger value="kronus_data">Dados do Kronus</Tabs.Trigger>
            <Tabs.Trigger value="flow_composer_data">Dados do Flow Composer</Tabs.Trigger>
         </Tabs.List>

         <Tabs.Content value="kronus_data">
            <Label class="text-lg">Dados do Kronus</Label>
            <Textarea rows="12" class="resize-none mt-3 font-code text-base" bind:value={kronusPayload} />
         </Tabs.Content>

         <Tabs.Content value="flow_composer_data">
            <Label class="text-lg">Dados do Flow Composer</Label>
            <Textarea rows="12" class="resize-none mt-3 font-code text-base" bind:value={flowComposerPayload} />
         </Tabs.Content>
      </Tabs.Root>
   </Card.Content>

   <Card.Footer>
      <Button on:click={convertKronusPayload}>Converter</Button>
   </Card.Footer>
</Card.Root>