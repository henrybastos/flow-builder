<script>
    export let modalTabs = ['default_tab'];
    export let activeTab = modalTabs[0];
</script>

<div class="mb-4">
    {#each modalTabs as tab}
        <button class:active_tab_btn={activeTab === tab} on:click={() => activeTab = tab} class="tab_btn">
            { tab }
        </button>
    {/each}
</div>

<slot {activeTab} />