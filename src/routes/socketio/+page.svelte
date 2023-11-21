<script>
    import { onMount } from "svelte";

    let SSEData = '';
    let cancelRequest = false;

    async function fetchServer () {
        const response = await fetch('http://localhost:5173/api/socket', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/event-stream'
            },
            body: {
            "user_id": 123
            }
        })

        console.log(response);
        await handleStream(response);
    }

    async function handleStream (_res) {
        const reader = _res.body.pipeThrough(new TextDecoderStream()).getReader();

        while (true) {
            const {value, done} = await reader.read();

            if (done) break;

            if (cancelRequest) {
                console.error('Close the browser!');
                await reader.cancel();
            }
            SSEData = JSON.parse(value);
            console.log(SSEData.msg);
        }
    }

    onMount(async () => {
        await fetchServer();
    })
</script>

<p>{ SSEData.msg }</p>

<button class="btn-md" on:click={() => cancelRequest = true}>Close conection</button>