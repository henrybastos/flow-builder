<script>
    import Toast from '$lib/components/Toast.svelte';

    let toastCollection = [];

    /**
     * 
     * @param _message {string}
     * @param _type {'success'|'info'|'error'|'danger'}
     */
    export function appendToast (_message, _type) {
        toastCollection = [...toastCollection, {
            message: _message,
            type: _type,
        }];
    }
</script>

<div class="fixed inset-0 top-3 bg-transparent z-50 flex flex-col justify-start items-end box-border overflow-hidden pointer-events-none">
    {#each toastCollection as toast}
        <Toast message={ toast.message } type={ toast.type }/>
    {/each}
 </div>