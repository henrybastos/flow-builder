<script>
   import Label from "$lib/components/ui/label/label.svelte";
   import Input from "$lib/components/ui/input/input.svelte";
   import * as Select from "$lib/components/ui/select";
   import * as Card from '$lib/components/ui/card';
   import { FLOW_BUILDER_OPERATION_TEMPLATES as OPERATIONS_SCHEMA } from "$lib/OperationTemplates";
   import Textarea from "$lib/components/ui/textarea/textarea.svelte";
   import FlowOperationDropdown from "./FlowOperationDropdown.svelte";
   import Button from "$lib/components/ui/button/button.svelte";
   import { getContext } from "svelte";

   export let flows;
   export let operation;

   let isDragActive = getContext('isDragActive');

   const operationSchema = OPERATIONS_SCHEMA[operation.data.command];
   let operationDescription = '';
   let canEditDescription = false;
   let editDescriptionInputValue;

   function saveEditedDescription () {
      operation.data.description = editDescriptionInputValue;
      canEditDescription = false;
   }
</script>

<Card.Root class="data-[draggy-active]:opacity-30 border-0 rounded-none">
   <Card.Header>
      <div class="inline-flex justify-between">
         <div class="inline-flex">
            <i data-draggy-grab class="ti ti-grip-vertical mr-3 cursor-grab text-blue-500"></i>
            <Card.Title class="text-xl">{ operationSchema.label }</Card.Title>
         </div>
         <FlowOperationDropdown bind:operation={operation} />
      </div>

      {#if operation.data?.description}   
         <div class="inline-flex group/edit-description space-x-3">
            {#if canEditDescription}
               <Input on:change={(evt) => editDescriptionInputValue = evt.target.value} value={operation.data.description} type="text" />
               <Button on:click={saveEditedDescription}>Save</Button>
               <Button on:click={() => canEditDescription = false} size="icon" variant="destructive">
                  <i class="ti ti-x"></i>
               </Button>
            {:else}
               <Card.Description class="text-base">{ operation.data.description }</Card.Description>
               <i on:click={() => canEditDescription = true} class="ti ti-pencil ml-3 invisible text-neutral-700 cursor-pointer hover:text-neutral-200 group-hover/edit-description:visible"></i>
            {/if}
         </div>
      {/if}
   </Card.Header>

   <Card.Content class="space-y-3">
      {#if operationSchema.input_fields}   
         {#each Object.entries(operationSchema.input_fields) as [command_name, command]}
            
            <!-- TEXT -->
            {#if command.type === 'text'}
               <div>
                  <Label class="text-lg">{ command.label }</Label>
                  
                  {#key operation.data[command_name]}   
                     {#if operation.data[command_name].match(/(?<=@@)([^@]+)(?=@)/g)}
                        <Input value={operation.data[command_name]} on:change={({ target }) => operation.data[command_name] = target.value} class="text-base mt-1 font-code text-orange-500" type="text" />                     
                     {:else if command.code_font}
                        <Input value={operation.data[command_name]} on:change={({ target }) => operation.data[command_name] = target.value} class="text-base mt-1 font-code text-green-500" type="text" />
                     {:else}
                        <Input value={operation.data[command_name]} on:change={({ target }) => operation.data[command_name] = target.value} class="text-base mt-1" type="text" />
                     {/if}
                  {/key}
               </div>
            {/if}

            <!-- TEXTAREA -->
            {#if command.type === 'textarea'}
               <div>
                  <Label class="text-lg">{ command.label }</Label>

                  {#key operation.data[command_name]}   
                     {#if operation.data[command_name].match(/(?<=@@)([^@]+)(?=@)/g)}
                        <Textarea wrap='off' rows="6" value={operation.data[command_name]} on:change={({ target }) => operation.data[command_name] = target.value} class="text-base mt-1 font-code text-orange-500" />
                        <!-- <Input  type="text" />                      -->
                     {:else if command.code_font}
                        <Textarea wrap='off' rows="6" value={operation.data[command_name]} on:change={({ target }) => operation.data[command_name] = target.value} class="text-base mt-1 font-code text-green-500" />
                     {:else}
                        <Textarea wrap='off' rows="6" value={operation.data[command_name]} on:change={({ target }) => operation.data[command_name] = target.value} class="text-base mt-1" />
                     {/if}
                  {/key}
               </div>
            {/if}

            <!-- DROPDOWN -->
            {#if command.type === 'dropdown'}
               <div>
                  <Label class="text-lg">{ command.label }</Label>
                  
                  <Select.Root onSelectedChange={(option) => operation.data[command_name] = option.value}>
                     <Select.Trigger class="mt-1 text-base capitalize">
                        <Select.Value class="text-base capitalize" placeholder={operation.data[command_name].replaceAll('_', ' ')} />
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