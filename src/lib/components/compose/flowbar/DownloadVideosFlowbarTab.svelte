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
   let playlistData;
   let convertedPlaylistData;

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

   const playlistDataPlaceholder = {
      "videos_count": 2,
      "videos": [
         {
            "index": 1,
            "time": "11:10",
            "time_in_seconds": 670,
            "lesson_title": "Bash Scripting on Linux (The Complete Guide) Class 01 - Course Introduction",
            "lesson_link": "https://www.youtube.com/watch?v=2733cRPudvI"
         },
         {
            "index": 2,
            "time": "17:24",
            "time_in_seconds": 1044,
            "lesson_title": "Bash Scripting on Linux (The Complete Guide) Class 02 - Hello World",
            "lesson_link": "https://www.youtube.com/watch?v=boqC9QenshY"
         }
      ]
   }

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

   function convertPlaylistData () {
      const playlistDataClone = structuredClone(JSON.parse(playlistData));
      try {
         const convertedData = {
            module_lessons: playlistDataClone.videos.map(vid => ({ 
               lesson_title: vid.lesson_title,
               lesson_link: vid.lesson_link
            }))
         }
         convertedPlaylistData = JSON.stringify([{ ...convertedData }], null, 3);
         toast.success('Playlist convertida');
      } catch (err) {
         console.error(err);
         toast.error('Falha ao converter a playlist');
      }
   }
</script>

<Card.Root class="mt-4 rounded-lg">
   <Card.Header>
      <Card.Title class="text-2xl font-bold">Download de Vídeos</Card.Title>
      <Card.Description class="text-base text-muted-foreground">
         Converte e faz download dos vídeos usando o YT DLP.
      </Card.Description>
   </Card.Header>

   <Card.Content>
      <Tabs.Root value="download_videos" class="w-full">
         <Tabs.List class="grid w-full grid-cols-2">
            <Tabs.Trigger value="download_videos">Download de Vídeos</Tabs.Trigger>
            <Tabs.Trigger value="playlist_data">Dados da Playlist</Tabs.Trigger>
         </Tabs.List>

         <Tabs.Content value="download_videos">
            <Label class="text-lg">Download de Vídeos</Label>
            
            <Textarea
               rows="12"
               class="resize-none mt-3 font-code text-base rounded-lg"
               bind:value={courseStructure}
               placeholder={JSON.stringify(courseStructurePlaceholder, null, 3)}
            />

            <div class="flex flex-row gap-x-2 mt-4">
               <Button on:click={downloadVideos}>Baixar vídeos</Button>
           </div>
         </Tabs.Content>

         <Tabs.Content value="playlist_data">
            <Label class="text-lg">Dados da playlist</Label>

            <Textarea
               rows="12"
               class="resize-none mt-3 font-code text-base"
               placeholder={JSON.stringify(playlistDataPlaceholder, null, 3)}
               bind:value={playlistData}
            />

            <div class="flex flex-row gap-x-2 mt-4">
               <Button on:click={convertPlaylistData}>Converter</Button>
               <Clipboard let:copyToClipboard bind:clipboardContent={convertedPlaylistData} {toast}>
                  <Button variant="secondary" on:click={copyToClipboard}>Copiar saída</Button>
               </Clipboard>
           </div>
         </Tabs.Content>
      </Tabs.Root>
   </Card.Content>
</Card.Root>