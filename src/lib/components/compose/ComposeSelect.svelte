<script>
   import * as Select from "$lib/components/ui/select";
   import ComposeLabel from "./ComposeLabel.svelte";
   import { createEventDispatcher } from "svelte";

   const dispatch = createEventDispatcher();

   export let options;
   export let placeholder = options[0].label || 'Selecione uma opção';
   export let tooltip = '';
   export let label;
</script>

<ComposeLabel {tooltip}>{label}</ComposeLabel>
<Select.Root onSelectedChange={(option) => dispatch('change', option)}>
   <Select.Trigger class="w-full text-base">
      <Select.Value {placeholder} />
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
