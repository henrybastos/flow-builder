<script>
   export let message;
</script>

<div class="flex font-code w-full">
   <span class="text-neutral-600">
      <span>{ message.date }</span>
      <span>{ message.time }</span>
      <span class={`tag_${ message.tag.type }`}>{ message.tag.label }</span>
      <span class="text-neutral-200">{ message.message }</span>
   </span>
</div>   

<style lang="postcss">
   .tag_success {
      @apply text-green-500;
  }

  .tag_info {
      @apply text-blue-500;
  }
</style>