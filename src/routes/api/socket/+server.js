export async function POST () {
    const stream = new ReadableStream({
		async start(controller) {
            let counter = 0;

            await enqueueMyData(controller, JSON.stringify({msg: `[SYS] Counter: ${ counter }`}));
            
            counter++
            await enqueueMyData(controller, JSON.stringify({msg: `[SYS] Counter: ${ counter }`}));
            
            // await enqueueMyData(controller, JSON.stringify({ msg: `[ERROR] Close browser` }));
            
            counter++
            await enqueueMyData(controller, JSON.stringify({msg: `[SYS] Counter: ${ counter }`}));
            
            counter++
            await enqueueMyData(controller, JSON.stringify({msg: `[SYS] Counter: ${ counter }`}));
		}
	});
    
    async function enqueueMyData (_ctrlr, _data) {
        await new Promise((res) => {
            setTimeout(res, 2000);
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