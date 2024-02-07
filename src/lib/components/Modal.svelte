<script>
    import { createEventDispatcher, onMount } from "svelte";
    import Toast from "./Toast.svelte";
    import { checkClickOnGuideIDs } from "$lib/utils";

    /**
     * @typedef {function} ShowToast
     * @param {string} _message
     * @param {'success'|'info'|'error'|'danger'} _type
     */

    const dispatch = createEventDispatcher();

    let modal, dangerModal, modalBody;
    let dangerConfirmEventMessage = 'danger_confirm';
    let modalToasts = [];

    export let title;
    export let dangerModalTitlePlaceholder = 'Danger';
    export let dangerConfirmPlaceholder = 'Confirm';
    export let dangerCancelPlaceholder = 'Cancel';
    export let dangerConfirmCallbackAction = null;
    export let openOnMount = false;

    export function dangerConfirmAction () {
        dispatch(dangerConfirmEventMessage);
        if (dangerConfirmCallbackAction) {
            dangerConfirmCallbackAction();
        }
        closeDangerModal();
    };

    /**
     * Opens the Danger modal.
     * @param {function} _callback
     * @param {{ danger_modal_title: string, danger_confirm: string, danger_cancel: string }} _options
     * @param {string} _danger_dispatch_message
     */
    export async function showDanger (_on_confirm_callback, _options, _danger_dispatch_message) {
        dangerConfirmEventMessage = _danger_dispatch_message;
        if (_on_confirm_callback) { 
            dangerConfirmCallbackAction = _on_confirm_callback; 
        }
        if (_options) { 
            const { danger_modal_title, danger_confirm, danger_cancel } = _options;
            dangerModalTitlePlaceholder = danger_modal_title || dangerModalTitlePlaceholder;
            dangerConfirmPlaceholder = danger_confirm || dangerConfirmPlaceholder;
            dangerCancelPlaceholder = danger_cancel || dangerCancelPlaceholder;
        }

        dangerModal.showModal();
    }

    
    export function open () {
        modal.showModal();
        dispatch('open');
    }
    
    export function close () {
        modal.close();
    }

    /** @type {ShowToast} */
    export function showToast (_message, _type) {
        console.log(`[${ _type.split('').map(w => w.toUpperCase()).join('') }] ${ _message }`);
        modalToasts = [...modalToasts, { message: _message, type: _type }];
    }
    
    function closeDangerModal () {
        dangerModal.close();
    }
    function handleOutsideClick ({ target }) {
        // if (!modalBody.contains(target)) {
        if (target === modal) {
            // console.log(target);
            close();
        }
    }

    onMount(() => {
        if (openOnMount) {
            open();
        }
    })
</script>

<dialog bind:this={dangerModal} class="nstd p-3">
    <div class="relative">
        <h3 class="text-2xl mb-6 ml-1 text-red-600 whitespace-nowrap">{ dangerModalTitlePlaceholder }</h3>
    </div>
    <div class="btn-bar">
        <button on:click={dangerConfirmAction} class="btn-sm btn-danger w-full">{ dangerConfirmPlaceholder }</button>
        <button on:click={closeDangerModal} class="btn-sm w-full">{ dangerCancelPlaceholder }</button>
    </div>
</dialog>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<dialog on:click={handleOutsideClick} on:open on:close bind:this={modal} class={`nstd max-h-[90vh] ${ $$restProps.class || 'w-[60rem]' } overflow-hidden`}>
    <div data-guide-id="" bind:this={modalBody} class="p-3">
        <div class="relative">
            <h3 class="text-2xl mb-6 mt-3 ml-1">{ title }</h3>
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <i on:click={close} class="ti ti-x align-middle absolute text-neutral-500 hover:text-neutral-300 cursor-pointer top-[50%] -translate-y-[50%] text-2xl right-6"></i>
        </div>
    
        <slot {showDanger} {showToast} />
        
        <!-- MODAL TOASTS -->
        <div class="fixed inset-0 top-3 bg-transparent z-50 flex flex-col justify-start items-end box-border overflow-hidden pointer-events-none">
            {#each modalToasts as { message, type }}
                <Toast { message } { type }/>
            {/each}
        </div>
    </div>
</dialog>