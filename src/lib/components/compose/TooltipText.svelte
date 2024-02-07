<script>
   import * as Tooltip from "$lib/components/ui/tooltip";
   export let text;
</script>

<Tooltip.Root>
   <Tooltip.Trigger tabindex={-1} class="cursor-help">
      <slot />
   </Tooltip.Trigger>
   <Tooltip.Content>
      <p class="text-sm">{ text }</p>
   </Tooltip.Content>
</Tooltip.Root>