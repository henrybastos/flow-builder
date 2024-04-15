<script>
   import DraggyItem from "./DraggyItem.svelte";
   export let contextID;
</script>

<DraggyItem data-draggy-member="draggy_void" isDraggable={false} item={{ id: `empty_id_${Math.random().toString().slice(2,10)}`, context_id: contextID }}>
   <div class={`drag_me_li relative select-none ${ $$restProps?.class || 'p-3 border-2 border-neutral-800 border-dashed rounded-lg' }`}>
      <slot />
   </div>
</DraggyItem>