<script>
   import { onMount, getContext, createEventDispatcher } from "svelte";
   // let isDragging = getContext('isDragging');
   let from = getContext('from');
   let list = getContext('list');
   let isDragging = getContext('isDragging');
   let globalList = getContext('globalList');
   let targetItem = getContext('targetItem');

   export let item;
   export let isDraggable = true;

   const thisList = $list.find(v => v.context_id == item.context_id).list;
   const dispatch = createEventDispatcher();
   let to;
   let targetList;
   let position;
   let mouseY;
   let fromList;
   let fromIndex;

   // $: console.log($from, to);

   function moveItem() {
      $targetItem.context_id = targetList.context_id;
      
      // Delete item from its origin list
      fromList.splice(fromIndex, 1);

      if (position) {
         // console.log(position);
         // Add item to the targeted list
         targetList.list.splice(to, 0, $targetItem);
      }

      // To update the list
      $list = $list;
      dispatch('draggychange', { item: $targetItem, from_list: fromList, to_list: targetList });
      // console.log(`From ${$from} to ${to}`);
   }

   function draggable(node) {
      node.addEventListener('mousemove', () => {
         if ($isDragging) {
            fromList = $list.find(v => v.context_id == $targetItem.context_id).list;
            fromIndex = fromList.indexOf(fromList.find(v => v.id == $targetItem.id));

            if ($targetItem.id !== node.dataset.draggyId) {
               const nodeRect = node.getBoundingClientRect();
               const height = nodeRect.bottom - nodeRect.top;
   
               if (mouseY > nodeRect.top && mouseY < nodeRect.bottom - (height / 2)) {
                  if (position !== 'up') {
                     position = 'up';
                     moveItem();
                     // $from = to;
                     // console.log('FROM TO', $from, to);
                  }
               } else if (mouseY < nodeRect.bottom && mouseY > nodeRect.top + (height / 2)) {
                  if (position !== 'down') {
                     position = 'down';
                     moveItem();
                     // $from = to;
                     // console.log('FROM TO', $from, to);
                  }
               }
            }
         }
      })

      if (isDraggable) {
         node.addEventListener('mousedown', () => {
            const index = thisList.indexOf(thisList.find(_item => _item.id == node.dataset.draggyId));
            // const nodeClone = node.cloneNode(true);
            
            // $from = index;
            $targetItem = thisList[index];
            // console.log(`Set $from ${$from}`);
         });
      }

      node.addEventListener('mouseover', () => {
         const index = thisList.indexOf(thisList.find(v => v.id == node.dataset.draggyId));

         node.style.background = '#222';
         
         if ($isDragging) {
            to = index;
            // console.log(node.dataset.draggyContext, $list.find(v => v.context_id == node.dataset.draggyContext));
            targetList = $list.find(v => v.context_id == node.dataset.draggyContext);
            // console.log(`Set to ${to}`);
         }
      })

      node.addEventListener('mouseleave', () => {
         node.style.background = 'transparent';
         position = null;
      })
   }

   onMount(() => {
      document.addEventListener('mousemove', (event) => {
         if ($isDragging) {
            mouseY = event.clientY;
         }
      })
   })
</script>

<div data-draggy-member="draggy_item" use:draggable data-draggy-id={item.id} data-draggy-context={item.context_id}>
   <slot />
</div>