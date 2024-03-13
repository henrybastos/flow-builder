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

   async function downloadVideos () {
      toast.info('Downloading...');
      
      const response = await fetch('/api/download-videos', {
         method: 'POST',
         body: JSON.stringify({ collection: courseStructure })
      })

      console.log(response);

      toast.info('Done.');
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
      <!-- <Tabs.Root value="kronus_data" class="w-full">
         <Tabs.List class="grid w-full grid-cols-2">
            <Tabs.Trigger value="kronus_data">Dados do Kronus</Tabs.Trigger>
            <Tabs.Trigger value="flow_composer_data"
               >Dados do Flow Composer</Tabs.Trigger
            >
         </Tabs.List>

         <Tabs.Content value="kronus_data">
            <Label class="text-lg">Dados do Kronus</Label>
            <Textarea
               rows="12"
               class="resize-none mt-3 font-code text-base"
               bind:value={kronusPayload}
            />

            <div class="flex flex-row gap-x-2 mt-4">
               <Button on:click={convertKronusPayload}>Converter</Button>
           </div>
         </Tabs.Content>

         <Tabs.Content value="flow_composer_data">
            <Label class="text-lg">Dados do Flow Composer</Label>
            
            <Textarea
               rows="12"
               class="resize-none mt-3 font-code text-base"
               bind:value={flowComposerPayload}
            />

            <div class="flex flex-row gap-x-2 mt-4">
               <Clipboard let:copyToClipboard bind:clipboardContent={flowComposerPayload} {toast}>
                  <Button variant="default" on:click={copyToClipboard}>Copiar saída</Button>
               </Clipboard>
           </div>
         </Tabs.Content>
      </Tabs.Root> -->
      <Textarea
         rows="12"
         class="resize-none mt-3 font-code text-base"
         bind:value={courseStructure}
      />

      <Button on:click={downloadVideos}>Download videos</Button>
   </Card.Content>
</Card.Root>