<script>
    import { onMount } from "svelte";

    let SSEData = '';

    onMount(async () => {
        const response = await fetch('http://localhost:5173/api/socket', {
            method: 'POST',
            headers: {
            'Content-Type': 'text/event-stream'
            },
            body: {
            "user_id": 123
            }
        })

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

        while (true) {
            const {value, done} = await reader.read();
            if (done) break;
            console.log(value);
            SSEData = value;
            if (SSEData.match(/\[ERROR\] Close browser/gi)) {
                console.error('Erro! Close the browser.');
                await reader.cancel();
            }
        }
    })
</script>

<p>{ SSEData }</p>