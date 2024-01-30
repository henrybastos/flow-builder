<script>
    import Modal from "../components/Modal.svelte";
    import { PAYLOAD } from "$lib/PayloadStore";
    import { convertToSnakeCase } from "$lib/utils";
    import * as Dialog from "$lib/components/ui/dialog";
    import Input from "$lib/components/ui/input/input.svelte";
    import Label from "$lib/components/ui/label/label.svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    let newFlowName;
    let isWSFlow = false;
    $: open = false;

    function addFlow () {
        PAYLOAD.addFlow(convertToSnakeCase(newFlowName), isWSFlow);
        PAYLOAD._fix_fixNullConfig();
        open = false;
    }

    function onWSSwitchToggle ({ detail }) {
        isWSFlow = detail;
    }
</script>

<Dialog.Root bind:open>
    <Dialog.Trigger asChild let:builder>
        <Button variant="secondary" class="w-28" builders={[builder]}>Add flow</Button>
    </Dialog.Trigger>
    
    <Dialog.Content>
        <Dialog.Header>
            <Dialog.Title>Add flow</Dialog.Title>
            <Dialog.Description>Adds a new flow to the payload.</Dialog.Description>
        </Dialog.Header>

        <Input on:change={({ target }) => newFlowName = target.value} type="text"/>
        <div class="grid grid-cols-2 gap-x-2">
            <Button variant="secondary" on:click={addFlow}>Add</Button>
            <Button variant="outline" on:click={() => open = false}>Cancel</Button>
        </div>
    </Dialog.Content>
</Dialog.Root>