<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";

    export let inputType: 'password' | 'text' | 'number' | 'email' = 'text';
    export let placeholder: string;
    export let autofocus = false; //! Might give autofocus processing alerts in console log. 
    export let value: string = '';
</script>

{#if autofocus}
    <Input autofocus {value} {placeholder} type={inputType} on:change class="text-base mt-1 mb-3 last:mb-0 placeholder:text-neutral-500"/>
{:else}
    <Input {value} {placeholder} type={inputType} on:change class="text-base mt-1 first:mt-0 placeholder:text-neutral-500"/>
{/if}