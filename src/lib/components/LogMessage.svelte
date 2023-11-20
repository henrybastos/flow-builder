<script>
   export let message;
</script>

<div class="font-code w-full">
   <span class="flex flex-nowrap text-neutral-600">
      <span>{ message.date } { message.time }</span>
      <span class={`tag_${ message.tag.type } mx-1`}>{ message.tag.label }</span>
      <span class="text-neutral-200 whitespace-nowrap">{ message.message }</span>
   </span>
</div>   

<style lang="postcss">
   .tag_success {
      @apply text-green-500;
  }

  .tag_info {
      @apply text-blue-500;
  }

  .tag_error {
      @apply text-red-600;
  }

  .tag_warning {
      @apply text-orange-500;
  }
</style>