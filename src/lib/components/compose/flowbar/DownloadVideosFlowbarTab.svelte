<script>
   import * as Card from "$lib/components/ui/card";
   import * as Tabs from "$lib/components/ui/tabs";
   import Button from "$lib/components/ui/button/button.svelte";
   import Label from "$lib/components/ui/label/label.svelte";
   import Textarea from "$lib/components/ui/textarea/textarea.svelte";
   import { getContext } from "svelte";
   import Clipboard from "$lib/components/Clipboard.svelte";

   const toast = getContext("toast");
   let courseStructure;

   const courseStructurePlaceholder = [
   {
      "module_lessons": [
         {
            "lesson_title": "Aula 002",
            "lesson_link": "https://www.youtube.com/watch?v=w7NqMEgXiGQ"
         }
      ]
   }
]

   async function callDOwnloadAPI () {
      return await fetch('/api/download-videos', {
         method: 'POST',
         body: JSON.stringify({ collection: courseStructure })
      })
   }

   async function downloadVideos () {
      toast.promise(callDOwnloadAPI, {
         loading: 'Loading...',
         success: 'Vídeos baixados com sucesso na pasta /videos',
         error: 'Erro ao baixar os vídeos.',
      });
   }

</script>

<Card.Root class="mt-4 rounded-lg">
   <Card.Header>
      <Card.Title class="text-2xl font-bold">Download de Vídeos</Card.Title>
      <Card.Description class="text-base text-muted-foreground">
         Faz download dos vídeos usando o YT DLP.
      </Card.Description>
   </Card.Header>

   <Card.Content>
      <Textarea
         rows="12"
         class="resize-none mt-3 p-6 font-code text-base rounded-lg"
         bind:value={courseStructure}
         placeholder={JSON.stringify(courseStructurePlaceholder, null, 3)}
      />

      <Button class="mt-6" on:click={downloadVideos}>Baixar vídeos</Button>
   </Card.Content>
</Card.Root>