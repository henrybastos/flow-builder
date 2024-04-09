<script>
    import { cn } from "$lib/utils";
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Button from "$lib/components/ui/button/button.svelte";

    export let isReadOnly = false;
    export let items;
    export let externalStorage = items;
    export let schema;
    export let template_schema;
    export let changesMade;
    export let canToggleEdit = true;
    
    export let isInputEditable = false;
    let startHold;

    function addItem () {
        items = [
            ...(items),
            structuredClone(template_schema)
        ]
        changesMade = true;
    }

    function clearItems () {
        items = [];
        changesMade = true;
    }

    function hold (node) {
        // Time to hold for to trigger the action
        const elapsedTime = 2;

        node.addEventListener("mousedown", () => {
            console.log('Start holding...');
            
            startHold = new Date(); // Record the startHold time
            
            setTimeout(function(){ 
                // If there is a start time and its now at least 2 seconds past that...
                if(startHold && (new Date() > startHold.setSeconds(startHold.getSeconds() + elapsedTime))){
                    clearItems();
                    startHold = null;
                }
            }, elapsedTime * 1000);
        });

        node.addEventListener("mouseup", function() {
            startHold = null; // Cancel the time
            console.log('End holding.');
        });
    }
</script>

<div class={cn("text-lg", $$restProps.class)}>
    <div class="flex flex-col border border-neutral-800 rounded-md p-3 gap-y-2 mt-1 mb-3 last:mb-0">
        <slot {isInputEditable} />
        {#if !isReadOnly}  
            <div class="pb-2 sticky -bottom-1 bg-neutral-950">
                <div class="grid grid-cols-3 gap-x-2 mt-2">
                    <Button class={`${ canToggleEdit ? 'col-span-1' : 'col-span-2' }`} on:click={addItem} size="sm" variant="ghost">
                        <i class="ti ti-plus"></i>
                    </Button>
            
                    {#if canToggleEdit}    
                        <Button on:click={() => isInputEditable = !isInputEditable} variant="ghost">
                            {#if isInputEditable}
                                Organizar <i class="ti ti-arrows-move ml-1"></i>
                            {:else}
                                Editar <i class="ti ti-pencil ml-1"></i>
                            {/if}
                        </Button>
                    {/if}

                    <!-- Gambiarration T _ T -->
                    <Tooltip.Root>
                        <Tooltip.Trigger tabindex={-1} asChild let:builder>
                            <Button builders={[builder]} class="text-sm col-span-1 overflow-hidden" size="sm" variant="destructive">
                                {#if startHold}
                                    <button class="w-[200rem] h-[6rem] cursor-wait" use:hold>
                                        <i class="flex h-fit w-fit mx-auto ti ti-loader-2 animate-spin text-neutral-400"></i>
                                    </button>
                                {:else}
                                    <button class="w-[200rem] h-[6rem] cursor-help" use:hold>Limpar lista</button>
                                {/if}
                            </Button>
                        </Tooltip.Trigger>
                        <Tooltip.Content>
                            <p class="text-sm">Clique e segure para remover todos os itens da lista</p>
                        </Tooltip.Content>
                    </Tooltip.Root>
                </div>
            </div>  
        {/if}
    </div>
</div>