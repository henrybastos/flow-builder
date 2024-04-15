<script>
   import { onMount, setContext } from "svelte";
   import { writable } from "svelte/store";
   
   export let list;

   let from = writable();
   let _list = writable(draggify(list));
   let isDragging = writable(false);
   let targetItem = writable();

   setContext('from', from);
   setContext('list', _list);
   setContext('isDragging', isDragging);
   setContext('targetItem', targetItem);

   function draggify (lists) {
      let newList = [];

      for (let [context, list] of Object.entries(lists)) {
         newList.push({
            context_id: context,
            list: list.map(item => ({
               id: `id_${Math.random().toString().slice(2,10)}`,
               context_id: context,
               data: item
            }))
         })
      }

      return newList;
   }

   function undraggify (lists) {
      let parsedObject = {};

      for (let [index, obj] of Object.entries(lists)) {
         parsedObject = { 
            ...parsedObject,
            [lists[index].context_id]: obj.list.map(item => item.data)
         };
      }

      // console.dir(parsedObject, { depth: null });
      // console.log(JSON.stringify(parsedObject, null, 3));
      return parsedObject;
   }

   $: {
      list = undraggify($_list);
   };
   
   onMount(() => {
      const defaultCursor = document.body.style.cursor;

      document.addEventListener('mouseup', () => {
         $isDragging = false;
         document.body.style.cursor = defaultCursor;
         document.body.style.userSelect = 'auto';
      });

      document.addEventListener('mousedown', (event) => {
         if (event.target.dataset.draggyGrab !== undefined) {
            $isDragging = true;
            document.body.style.cursor = 'grabbing';
            document.body.style.userSelect = 'none';
         }
      });
   })
</script>

<div class={$$restProps?.class || ''} data-draggy-member="draggy_root">
   <slot list={$_list} />
</div>