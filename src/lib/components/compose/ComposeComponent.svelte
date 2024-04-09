<script lang="ts">
   import ComposeInputList from "$lib/components/compose/ComposeInputList.svelte";
   import ComposeInput from "$lib/components/compose/ComposeInput.svelte";
   import ComposeLabel from "$lib/components/compose/ComposeLabel.svelte";
   import ComposeSelect from "./ComposeSelect.svelte";
   import Button from "$lib/components/ui/button/button.svelte";

   import Draggable from "$lib/components/Draggable.svelte";
   let isOnDrag = false;
   let dragFromIndex: number;
   let dragToIndex: number;
   let isDraggable = true;
   
   export let isInputEditable = true;
   export let data: any;
   export let value: any;
   export let changesMade: boolean;

   $: isInputReadonly = !isInputEditable

   function triggerChange(cb: Function) {
      cb();
      changesMade = true;
   }

   //==================== DRAGGABLE ====================/
   function handleDragStart({ detail }: { detail: { from: number } }) {
      dragFromIndex = detail.from;
      isOnDrag = isDraggable;
   }

   function handleDragEnd() {
      isOnDrag = false;
   }

   function handleDrop({ detail }: { detail: { to: number } }) {
      dragToIndex = detail.to;

      let itemToInsert = value[dragFromIndex];
      value[dragFromIndex] = {
         __draggable_item_to_delete__: value[dragFromIndex],
      };

      if (dragToIndex === value.length + 1) {
         value.splice(dragToIndex + 1, 0, itemToInsert);
      } else {
         value.splice(dragToIndex, 0, itemToInsert);
      }

      value.splice(
         value.indexOf(value.find((item) => item.__draggable_item_to_delete__)),
         1,
      );

      changesMade = true;
   }
   //===================================================/

   function removeItemFromList (index) {
      value = value.filter((_,i) => i != index);
      changesMade = true;
   }
</script>

{#if data?.schema?.fields_type === undefined}
   <!-- <pre class="p-4 border border-orange-600 rounded-md">{ JSON.stringify(data, null, 3) }</pre> -->
   {#if data?.schema}
      <ComposeLabel tooltip={data.schema?.tooltip}
         >{data.schema.label}</ComposeLabel
      >
      <ComposeInput
         inputType={data.schema.type}
         placeholder={data.schema.placeholder}
         value={value}
         bind:readonly={isInputReadonly}
         on:change={(evt) => triggerChange(() => (value = evt.target.value))}
         on:focus
         on:focusout
      />
   {:else}
      <ComposeLabel tooltip={data?.tooltip}>{data.label}</ComposeLabel>
      <ComposeInput
         inputType={data.type}
         placeholder={data.placeholder}
         bind:value
         bind:readonly={isInputReadonly}
         on:change
         on:focus
         on:focusout
      />
   {/if}
{:else if data?.schema?.fields_type === "array"}
   <ComposeLabel tooltip={data.schema?.tooltip}>
      {data.schema.label}
   </ComposeLabel>
   <ComposeInputList
      schema={data.schema}
      template_schema={data.template_schema}
      bind:items={value}
      bind:changesMade={changesMade}
      on:change
      on:clear_items={() => value = []}
      canToggleEdit={true}
      bind:isInputEditable
   >
      {#if value.length === 0}
         <p class="text-base mx-auto text-neutral-500">
            Lista vazia <i class="ti ti-ghost-2-filled"></i>
         </p>
      {:else}
         {#each value as item, index}
            {#if isInputEditable}
               <div class={`grid grid-cols-[min-content_auto] p-4 border border-neutral-800 rounded-md`} >
                  {#each Object.keys(item) as item_key}
                     <svelte:self
                        on:change={(evt) => triggerChange(() => (item[item_key] = evt.target?.value))}
                        bind:changesMade={changesMade}
                        bind:value={item[item_key]}
                        bind:data={data.schema.fields[item_key]}
                        on:focus
                        on:focusout
                     />
                  {/each}
               </div>
            {:else}
               <Draggable
                  {isOnDrag}
                  on:dragstart={handleDragStart}
                  on:dragend={handleDragEnd}
                  on:drop={handleDrop}
                  activeIndex={dragFromIndex}
                  lastIndex={value.length}
                  cardIndex={index}
               >
                  <div class={`grid grid-cols-[min-content_auto] p-4 border border-neutral-800 rounded-md ${ isInputEditable ? 'cursor-default' : 'cursor-move' }`} >
                     {#each Object.keys(item) as item_key}
                        <svelte:self
                           on:change={(evt) => triggerChange(() => (item[item_key] = evt.target?.value))}
                           bind:changesMade={changesMade}
                           bind:value={item[item_key]}
                           bind:data={data.schema.fields[item_key]}
                           on:focus
                           on:focusout
                        />
                     {/each}
                     <Button on:click={() => removeItemFromList(index)} class="col-span-full ml-auto uppercase mt-2 h-7 w-7" variant="destructive" size="icon">
                        <i class="ti ti-x"></i>
                     </Button>
                  </div>
               </Draggable>
            {/if}
         {/each}
      {/if}
   </ComposeInputList>
{:else if data?.schema?.fields_type === "object"}
   <ComposeLabel tooltip={data.schema.tooltip} groupType="object">
      Credenciais
   </ComposeLabel>

   <div class="border border-neutral-800 rounded-md p-3 mt-1 mb-3 last:mb-0">
      {#each Object.entries(data.schema.fields) as [field_name, field]}
         <ComposeLabel tooltip={field.tooltip}>{field.label}</ComposeLabel>
         <ComposeInput
            inputType={field.type}
            placeholder={field.placeholder}
            on:change={(evt) => updateObject(evt, data.value, field_name)}
            on:focus
            on:focusout
         />
      {/each}
   </div>
{:else if data?.schema?.fields_type === "select"}
   <ComposeSelect placeholder={data.value} on:change={({ detail }) => triggerChange(() => data.value = detail.value)} label={data.schema.label} options={data.schema.options}/>
{:else}
   <h1>INVALID</h1>
   <pre>{JSON.stringify(data, null, 3)}</pre>
{/if}