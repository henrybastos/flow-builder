export async function POST () {
    const stream = new ReadableStream({
		async start(controller) {
            let counter = 0;

            await enqueueMyData(controller, `[SYS] Counter: ${ counter }`);
            
            counter++
            await enqueueMyData(controller, `[SYS] Counter: ${ counter }`);
            
            await enqueueMyData(controller, `[ERROR] Close browser`);
            
            counter++
            await enqueueMyData(controller, `[SYS] Counter: ${ counter }`);
            
            counter++
            await enqueueMyData(controller, `[SYS] Counter: ${ counter }`);
		}
	});
    
    async function enqueueMyData (_ctrlr, _data) {
        await new Promise((res) => {
            setTimeout(res, 5000);
        })
        _ctrlr.enqueue(_data);
        return;
    }

    return new Response(stream, {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
            'Access-Control-Allow-Origin': '*',
            'Connection': 'keep-alive',
        }
    });
}