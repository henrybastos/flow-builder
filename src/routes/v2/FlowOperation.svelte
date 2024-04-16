<script>
   import Label from "$lib/components/ui/label/label.svelte";
   import Input from "$lib/components/ui/input/input.svelte";
   import * as Select from "$lib/components/ui/select";
   import * as Card from '$lib/components/ui/card';
   import { FLOW_BUILDER_OPERATION_TEMPLATES as OPERATIONS_SCHEMA } from "$lib/OperationTemplates";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";

   export let flows;
   export let operation;

   const operationSchema = OPERATIONS_SCHEMA[operation.command];
   
   // if(operationSchema.input_fields) {
   //    for (let [command_name, command] of Object.entries(operationSchema.input_fields)) {
   //       console.log(command);
   //    }
   // }

   // console.log(Object.keys(flows));
</script>

<Card.Root class="data-[draggy-active]:border-neutral-500">
   <Card.Header class="flex flex-row items-center">
      <i data-draggy-grab class="ti ti-menu-2 mr-3 cursor-grab text-blue-500"></i>
      <Card.Title class="text-xl">{ operationSchema.label }</Card.Title>
   </Card.Header>

   <Card.Content class="space-y-3">
      {#if operationSchema.input_fields}   
         {#each Object.entries(operationSchema.input_fields) as [command_name, command]}
            
            <!-- TEXT -->
            {#if command.type === 'text'}
               <div>
                  <Label class="text-lg">{ command.label }</Label>
                  
                  {#key operation[command_name]}   
                     {#if operation[command_name].match(/(?<=@@)([^@]+)(?=@)/g)}
                        <Input value={operation[command_name]} on:change={({ target }) => operation[command_name] = target.value} class="text-base mt-1 font-code text-orange-500" type="text" />                     
                     {:else if command.code_font}
                        <Input value={operation[command_name]} on:change={({ target }) => operation[command_name] = target.value} class="text-base mt-1 font-code text-green-500" type="text" />
                     {:else}
                        <Input value={operation[command_name]} on:change={({ target }) => operation[command_name] = target.value} class="text-base mt-1" type="text" />
                     {/if}
                  {/key}
               </div>
            {/if}

            <!-- TEXTAREA -->
            {#if command.type === 'textarea'}
               <div>
                  <Label class="text-lg">{ command.label }</Label>

                  {#key operation[command_name]}   
                     {#if operation[command_name].match(/(?<=@@)([^@]+)(?=@)/g)}
                        <Textarea wrap='off' rows="6" value={operation[command_name]} on:change={({ target }) => operation[command_name] = target.value} class="text-base mt-1 font-code text-orange-500" />
                        <!-- <Input  type="text" />                      -->
                     {:else if command.code_font}
                        <Textarea wrap='off' rows="6" value={operation[command_name]} on:change={({ target }) => operation[command_name] = target.value} class="text-base mt-1 font-code text-green-500" />
                     {:else}
                        <Textarea wrap='off' rows="6" value={operation[command_name]} on:change={({ target }) => operation[command_name] = target.value} class="text-base mt-1" />
                     {/if}
                  {/key}
               </div>
            {/if}

            <!-- DROPDOWN -->
            {#if command.type === 'dropdown'}
               <div>
                  <Label class="text-lg">{ command.label }</Label>
                  
                  <Select.Root onSelectedChange={(option) => operation[command_name] = option.value}>
                     <Select.Trigger class="mt-1 text-base capitalize">
                        <Select.Value placeholder="-" />
                     </Select.Trigger>
                     <Select.Content>
                        {#each Object.keys(flows) as flow}
                           <Select.Item value={flow} label={flow.replaceAll('_', ' ')} class="text-base capitalize">{ flow.replaceAll('_', ' ') }</Select.Item>
                        {/each}
                     </Select.Content>
                  </Select.Root>
               </div>
            {/if}

         {/each}
      {:else}
         <p>No commands</p>
      {/if}
   </Card.Content>
</Card.Root>