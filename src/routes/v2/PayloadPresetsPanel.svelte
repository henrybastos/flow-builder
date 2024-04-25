<script>
   import * as Card from "$lib/components/ui/card";
   import * as Table from "$lib/components/ui/table";

   export let isPanelOpen;
</script>

<Card.Root bind:open={isPanelOpen}>
   <Card.Content>
      <Card.Header>
         <Card.Title>Payload Presets</Card.Title>
      </Card.Header>

      <Table.Root>
         <Table.Caption>A list of your recent invoices.</Table.Caption>
         <Table.Header>
            <Table.Row>
               <Table.Head class="w-[100px]">Invoice</Table.Head>
               <Table.Head>Status</Table.Head>
               <Table.Head>Method</Table.Head>
               <Table.Head class="text-right">Amount</Table.Head>
            </Table.Row>
         </Table.Header>
         <Table.Body>
            <Table.Row>
               <Table.Cell>Test 1</Table.Cell>
               <Table.Cell>Test 2</Table.Cell>
               <Table.Cell>Test 3</Table.Cell>
               <Table.Cell>Test 4</Table.Cell>
            </Table.Row>
         </Table.Body>
      </Table.Root>      
   </Card.Content>
</Card.Root>