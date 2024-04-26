<script>
   import * as Dialog from "$lib/components/ui/dialog";
   import * as Table from "$lib/components/ui/table";
   import * as RadioGroup from "$lib/components/ui/radio-group";
   import { ScrollArea } from "$lib/components/ui/scroll-area";

   export let isPanelOpen = false;

   let checked = false;
</script>

<Dialog.Root bind:open={isPanelOpen}>
   <Dialog.Content class="max-w-[40rem]">
      <Dialog.Header>
         <Dialog.Title class="text-2xl">Payload Presets</Dialog.Title>
      </Dialog.Header>

      <ScrollArea class="h-[30rem] px-4" orientation="vertical">
          <Table.Root>
            <Table.Caption>All user payload presets.</Table.Caption>
            <Table.Header>
               <Table.Row>
                  <Table.Head class="w-[10rem]">Name</Table.Head>
                  <Table.Head>Description</Table.Head>
                  <Table.Head>Date</Table.Head>

               </Table.Row>
            </Table.Header>
            <Table.Body>
               <RadioGroup.Root bind:value={checked} class="flex flex-col space-y-1">
                  <RadioGroup.Item value="all" />
                     <Table.Row>
                        <Table.Cell>Tabler.io Scraper</Table.Cell>
                        <Table.Cell>Scrapes icons from Tabler.io</Table.Cell>
                        <Table.Cell>26/04/2024 - 14h21</Table.Cell>
                     </Table.Row>
                  <RadioGroup.Input name="type" />
                </RadioGroup.Root>
            </Table.Body>
         </Table.Root>      
      </ScrollArea>
   </Dialog.Content>
</Dialog.Root>