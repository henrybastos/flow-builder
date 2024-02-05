<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";

    export let inputType: 'password' | 'text' | 'number' | 'email' = 'text';
    export let placeholder: string;
    export let value: string = '';
    export let readonly = false;
</script>

{#if readonly}
    <Input readonly {value} {placeholder} type={inputType} class="text-base mt-1 first:mt-0 placeholder:text-neutral-500 cursor-default"/>
{:else}    
    <Input {value} {placeholder} type={inputType} on:change class="text-base mt-1 first:mt-0 placeholder:text-neutral-500"/>
{/if}