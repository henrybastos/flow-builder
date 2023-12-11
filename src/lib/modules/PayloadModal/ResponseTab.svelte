<script>
    import { ServerHandler } from "$lib/ServerHandler";
    import GraphicalJson from "$lib/components/GraphicalJSON.svelte";
    import { slide } from "svelte/transition";
    import { copyToClipboard } from "$lib/utils";
</script>

<section transition:slide={{ duration: 400 }}>
    <div class="max-h-[36rem] overflow-y-auto rounded-md">
        <button class="clear-btn mb-2" on:click={() => copyToClipboard(ServerHandler.responsePayload)}>Copy JSON</button>
        <GraphicalJson key="response_payload" values={ JSON.parse(ServerHandler.responsePayload) }/>
    </div>
    <!-- <textarea class="font-code bg-neutral-950 hover:bg-neutral-950" bind:value={responsePayload} name="" id="" cols="30" rows="20"></textarea> -->
</section>