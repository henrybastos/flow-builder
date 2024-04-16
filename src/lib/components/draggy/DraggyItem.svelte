<script>
   import { onMount, getContext, createEventDispatcher } from "svelte";
   // let isDragging = getContext('isDragging');
   let list = getContext('list');
   let isDragging = getContext('isDragging');
   let targetItem = getContext('targetItem');

   export let item;
   export let isDraggable = true;

   const thisList = $list.find(v => v.context_id == item.context_id).list;
   const dispatch = createEventDispatcher();
   let thisNode;
   let to;
   let targetList;
   let position;
   let mouseY;
   let fromList;
   let fromIndex;

   // $: console.log($from, to);
   $: {
      if(thisNode && $targetItem) {
         if ($isDragging && $targetItem.id === thisNode.dataset.draggyId) {
            thisNode.firstChild.dataset.draggyActive = '';
         } else {
            delete thisNode.firstChild.dataset.draggyActive;
         }
      }
   };

   function moveItem() {
      $targetItem.context_id = targetList.context_id;
      
      // Delete item from its origin list
      fromList.splice(fromIndex, 1);

      if (position) {
         // Add item to the targeted list
         targetList.list.splice(to, 0, $targetItem);
      }

      // To update the list
      $list = $list;
      dispatch('draggychange', { item: $targetItem, from_list: fromList, to_list: targetList });
   }

   function draggable(node) {
      thisNode = node;
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
                  }
               } else if (mouseY < nodeRect.bottom && mouseY > nodeRect.top + (height / 2)) {
                  if (position !== 'down') {
                     position = 'down';
                     moveItem();
                  }
               }

            }
         }
      })

      if (isDraggable) {
         node.addEventListener('mousedown', () => {
            const index = thisList.indexOf(thisList.find(_item => _item.id == node.dataset.draggyId));
            
            $targetItem = thisList[index];
         });
      }

      node.addEventListener('mouseover', () => {
         const index = thisList.indexOf(thisList.find(v => v.id == node.dataset.draggyId));

         if ($isDragging) {
            to = index;
            targetList = $list.find(v => v.context_id == node.dataset.draggyContext);
         }
      })

      node.addEventListener('mouseleave', () => {
         position = null;
      });
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