<script>
    import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    let modal;
    export let title;

    export function open () {
        modal.showModal();
        dispatch('open');
    }

    export function close () {
        modal.close();
    }
</script>

<dialog on:open on:close bind:this={modal} class="max-h-[80vh] w-[50vw] open:flex flex-col transition-all bg-neutral-900 p-3 rounded-lg border-2 border-neutral-800 text-neutral-50 backdrop:opacity-75 backdrop:bg-black"
>
    <div class="relative">
        <h3 class="text-2xl mb-6 mt-3 ml-1">{ title }</h3>
        <i class="ti ti-x align-middle absolute text-neutral-500 hover:text-neutral-300 cursor-pointer top-[50%] -translate-y-[50%] text-2xl right-6" on:click={close}></i>
    </div>
    <slot />
</dialog>