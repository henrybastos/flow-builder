<script>
    import { createEventDispatcher } from "svelte";
    import Toast from "./Toast.svelte";

    const dispatch = createEventDispatcher();

    let modal, dangerModal;
    let dangerConfirmEventMessage = 'danger_confirm';

    export let title;
    export let dangerModalTitlePlaceholder = 'Danger';
    export let dangerConfirmPlaceholder = 'Confirm';
    export let dangerCancelPlaceholder = 'Cancel';
    export let dangerConfirmCallbackAction;

    export function dangerConfirmAction () {
        dispatch(dangerConfirmEventMessage);
        if (dangerConfirmCallbackAction) {
            dangerConfirmCallbackAction();
        }
        closeDangerModal();
    };

    export async function openDangerModal (_callback, _options, _danger_dispatch_message) {
        dangerConfirmEventMessage = _danger_dispatch_message;
        if (_callback) { 
            dangerConfirmCallbackAction = _callback; 
        }
        if (_options) { 
            const { danger_modal_title, danger_confirm, danger_cancel } = _options;
            dangerModalTitlePlaceholder = danger_modal_title || dangerModalTitlePlaceholder;
            dangerConfirmPlaceholder = danger_confirm || dangerConfirmPlaceholder;
            dangerCancelPlaceholder = danger_cancel || dangerCancelPlaceholder;
        }

        dangerModal.showModal();
    }

    function closeDangerModal () {
        dangerModal.close();
    }

    export function open () {
        modal.showModal();
        dispatch('open');
    }

    export function close () {
        modal.close();
    }
</script>

<dialog bind:this={dangerModal} class="max-w-[32rem]">
    <div class="relative">
        <h3 class="text-2xl mb-6 ml-1 text-red-600 whitespace-nowrap">{ dangerModalTitlePlaceholder }</h3>
    </div>
    <div class="btn-bar">
        <button on:click={dangerConfirmAction} class="btn-sm btn-danger w-full">{ dangerConfirmPlaceholder }</button>
        <button on:click={closeDangerModal} class="btn-sm w-full">{ dangerCancelPlaceholder }</button>
    </div>
</dialog>

<dialog on:open on:close bind:this={modal} class="max-h-[80vh] w-[50vw]">
    <div class="relative">
        <h3 class="text-2xl mb-6 mt-3 ml-1">{ title }</h3>
        <i on:click={close} class="ti ti-x align-middle absolute text-neutral-500 hover:text-neutral-300 cursor-pointer top-[50%] -translate-y-[50%] text-2xl right-6"></i>
    </div>
    <slot {openDangerModal} />
    
    <!-- MODAL TOASTS -->
    <!-- <div class="fixed inset-0 top-3 bg-transparent z-50 flex flex-col justify-start items-end box-border overflow-hidden pointer-events-none">
        <Toast message="aa" />
    </div> -->
</dialog>
