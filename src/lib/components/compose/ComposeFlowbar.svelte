<script>
   import * as Sheet from "$lib/components/ui/sheet";
   import * as Tabs from "$lib/components/ui/tabs";
   import Button from "$lib/components/ui/button/button.svelte";
   import KronusLessonConverterFlowbarTab from "./flowbar/KronusLessonConverterFlowbarTab.svelte";
   import CourseStructureConverterFlowbarTab from "./flowbar/CourseStructureConverterFlowbarTab.svelte";
   import DownloadVideosFlowbarTab from "./flowbar/DownloadVideosFlowbarTab.svelte";
</script>

<Sheet.Root>
   <Sheet.Trigger class="absolute w-full bottom-[3.5rem] hover:pb-1 transition-all">
      <i class="ti ti-chevron-compact-up text-neutral-300 text-2xl px-[10rem]"></i>
   </Sheet.Trigger>
   <Sheet.Content side="bottom" class="flex flex-col items-center h-[90vh]">
      <Sheet.Header>
         <Sheet.Title class="text-2xl text-center">Flowbar</Sheet.Title>
         <Sheet.Description class="text-base text-center">A sua barra de utilidades.</Sheet.Description>
      </Sheet.Header>

      <Tabs.Root value="kronus_lesson_converter" class="w-full">
         <Tabs.List class="grid w-full grid-cols-3">
            <Tabs.Trigger class="data-[state=active]:bg-sky-400 text-base" value="kronus_lesson_converter">Conversor de Aulas Kronus</Tabs.Trigger>
            <Tabs.Trigger class="data-[state=active]:bg-sky-400 text-base" value="course_structure_converter">Conversor de Estrutura do Curso</Tabs.Trigger>
            <Tabs.Trigger class="data-[state=active]:bg-sky-400 text-base" value="videos_download">Download de vídeos</Tabs.Trigger>
         </Tabs.List>

         <Tabs.Content value="kronus_lesson_converter">
            <KronusLessonConverterFlowbarTab />
         </Tabs.Content>
         
         <Tabs.Content value="course_structure_converter">
            <CourseStructureConverterFlowbarTab />
         </Tabs.Content>
         
         <Tabs.Content value="videos_download">
            <DownloadVideosFlowbarTab />
         </Tabs.Content>
      </Tabs.Root>

      <Sheet.Footer class="w-full">
         <Sheet.Close asChild let:builder>
            <Button class="w-1/3 mx-auto text-base" variant="ghost" builders={[builder]}>Fechar</Button>
         </Sheet.Close>
      </Sheet.Footer>
   </Sheet.Content>
</Sheet.Root>
