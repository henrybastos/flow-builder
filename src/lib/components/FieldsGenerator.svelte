<script>
    import Fieldset from "$lib/components/Fieldset.svelte";
    import LabeledInput from "$lib/components/LabeledInput.svelte";
    import LabeledTextarea from "$lib/components/LabeledTextarea.svelte";
    
    /** @type {Object[]} */
    export let fields

    /** @type {string} */
    export let id;
    let reload = false;

    function updateRawData (_key, _value, _evt = null) {
        console.log(_value);
        if (_evt) {
            _evt.target.value = _value.trim();
        }
        console.log(_evt.target.value);
    }

    function addItem (field) {
        if (field.items.length < (field.max || 250)) {
            reload = !reload; // Used to update the DOM with the new instances
            let newItemInstance = structuredClone(field.item_template);
    
            // Sets the label to %label% and it's index
            // e.g. Title 1
            newItemInstance.title.label = `${ newItemInstance.title.label } ${ field.items.length + 1 }`
    
            field.items.push(newItemInstance);
        }
    }

    // Generates automatically each static field of the repeaters
    fields.forEach(field => {
        if (field?.count) {
            for (let i = 0; i < field.count; i++) {
                addItem(field);
            }
        }
    });
</script>

{#each fields as field, index}
    {#if field?.interface === 'textarea'}
        <LabeledTextarea 
            inputName={ id } 
            inputLabel={ field.label } 
            inputPlaceholder={ field.placeholder }
            bind:inputValueHandler={ field.value }
            on:change={ (evt) => updateRawData(id, evt.target.value, evt) }
            rows={ field.rows } 
        />
    {:else if field?.interface === 'repeater'}
        <Fieldset legend={ field.label }>
                {#key reload}
                    {#if field?.dynamic}
                        <button class="btn-sm mb-4 ml-auto" on:click={() => addItem(field)}>
                            <i class="ti ti-circle-plus"></i>
                            Add
                        </button>
                    {/if}

                    {#each field.items as item, index}
                        <svelte:self fields={ Object.values(item) } id={`${ field.label.toLowerCase().replaceAll(' ', '_') }_${ index }`}/>
                        
                        {#if index !== field.items.length - 1 && item.title}
                            <hr />
                        {/if}
                    {/each}
                {/key}
        </Fieldset>
    {:else}
        <LabeledInput 
            bind:inputValueHandler={ field.value }
            inputName={ id }
            inputLabel={ field.label } 
            inputPlaceholder={ field.placeholder } 
            on:change={ (evt) => updateRawData(id, evt.target.value) }
        />
    {/if}
{/each}
