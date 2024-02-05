<script lang="ts">
   import { createEventDispatcher } from "svelte";
   import type { EnvProps, EnvSchema } from "$lib/types";
   import ComposeInput from "$lib/components/compose/ComposeInput.svelte";
   import ComposeInputList from "$lib/components/compose/ComposeInputList.svelte";
   import ComposeLabel from "$lib/components/compose/ComposeLabel.svelte";
   
   const dispatch = createEventDispatcher();

   function updateString (evt: Event, value: string) {
      value = evt.target.value;
      dispatch('change');
   }

   function updateObject (evt: Event, value: string) {
      value[field_name] = (evt.target as HTMLInputElement).value
      dispatch('change');
   }

   export let data: EnvProps;
</script>

{#if typeof data.value == 'string'}
   <ComposeLabel tooltip={data.schema.tooltip}>{data.schema.label}</ComposeLabel>
   <ComposeInput
         inputType={data.schema.type}
         placeholder={data.schema.placeholder}
         on:change={(evt) => updateString(evt, data.value)} 
   />
{:else if data.schema.fields_type === 'array'}
   <ComposeLabel tooltip={data.schema.tooltip}>{ data.schema.label }</ComposeLabel>
   <ComposeInputList 
         listName={data.schema.label} 
         labelContent={data.schema.label}
         bind:items={data}
         on:change
   >
      {#each data.value as item}
         {#each Object.keys(item) as item_key}
            {#if data?.schema?.fields?.[item_key]?.schema?.fields_type == 'array'}
               <pre>{ JSON.stringify(data.schema.fields[item_key].schema.fields_type, null, 3) }</pre>
               <p>list { data.schema.fields[item_key] }</p>
            {:else}
               <p>input</p>
            {/if}
         {/each}
      {/each}
      <!-- {#if Array.isArray(data?.value) && data?.value?.length === 0}
         <p class="text-base mx-auto text-neutral-500">No items <i class="ti ti-ghost-2-filled"></i></p>    
      {:else}
         <DraggableList on:change isDraggable={!isInputEditable} bind:itemsList={data.value} let:index class="space-y-3">
            <div class={`grid grid-cols-[min-content_auto] p-4 border border-neutral-800 rounded-md ${ isInputEditable ? '' : 'cursor-move' }`}>
               <p>AAA</p>
            </div>
         </DraggableList>
      {/if} -->
   </ComposeInputList>
{:else if data.schema.fields_type === 'object'}
   <ComposeLabel tooltip={data.schema.tooltip} groupType="object">Credenciais</ComposeLabel>
   <div class="border border-neutral-800 rounded-md p-3 mt-1 mb-3 last:mb-0">
         {#each Object.entries(data.schema.fields) as [field_name, field]}
            <ComposeLabel tooltip={field.tooltip}>{ field.label }</ComposeLabel>
            <ComposeInput 
               inputType={field.type} 
               placeholder={field.placeholder} 
               on:change={(evt) => updateObject(data.value, evt)}
            />
         {/each}
   </div>
{:else}
   <h1>INVALID</h1>
   <pre>{ JSON.stringify(data, null, 3) }</pre>
{/if}