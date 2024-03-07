<script>
   let textareaElement;
   export let clipboardContent;
   export let toast;

   export function copyToClipboard () {
        if (navigator.clipboard && window.isSecureContext) {
            window.navigator.clipboard.writeText(clipboardContent);
            console.log('[SECURE CONTEXT] Content copied to the clipboard');
        } else {
            console.warn(`Context is not secure (${ window.isSecureContext }). Using select and copy.`);
            textareaElement.select();
            document.execCommand('copy');
            console.log('[INSECURE CONTEXT] Content copied to the clipboard');
        }
        
        if (toast) {
           toast.success('Saída copiada para a Área de Transferência!');
        }
   }
</script>

<slot {copyToClipboard} />
<textarea id="copy-only-field" bind:this={textareaElement} class="h-0 w-0 opacity-0 -z-50">{ clipboardContent }</textarea>