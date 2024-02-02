<script lang="ts">
    import Input from "$lib/components/ui/input/input.svelte";

    export let inputType: 'password' | 'text' | 'number' | 'email' = 'text';
    export let placeholder: string;
    export let value: string = '';
</script>

<Input {value} {placeholder} type={inputType} on:change class="text-base mt-1 first:mt-0 placeholder:text-neutral-500"/>