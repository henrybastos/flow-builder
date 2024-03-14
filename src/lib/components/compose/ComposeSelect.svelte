<script>
   import * as Select from "$lib/components/ui/select";
   import ComposeLabel from "./ComposeLabel.svelte";
   import { createEventDispatcher, onMount } from "svelte";

   const dispatch = createEventDispatcher();

   export let options;
   export let placeholder;
   export let tooltip = '';
   export let label;

   function onChange (option) {
      dispatch('change', option);
      console.log(option);
      placeholder = option.label;
   }

   onMount(() => {
      placeholder = options.find(v => v.value === placeholder)?.label || placeholder;
   })
</script>

<ComposeLabel {tooltip}>{label}</ComposeLabel>
<Select.Root onSelectedChange={onChange}>
   <Select.Trigger class="w-full text-base">
      <Select.Value placeholder={ placeholder || "Selecione uma opção" } />
   </Select.Trigger>
   <Select.Content class="max-h-[20rem] overflow-y-auto">
      {#each options as opt}
         {#if typeof opt === 'string'}
            <Select.Item class="text-base" value={opt} label={opt}>
               {opt}
            </Select.Item>
         {:else}   
            <Select.Item class="text-base" value={opt.value} label={opt.label}>
               {opt.label}
            </Select.Item>
         {/if}
      {/each}
   </Select.Content>
   <Select.Input name="favoriteFruit" />
</Select.Root>
