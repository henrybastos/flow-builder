import fs from 'fs';

/**
 * 
 * @param {{request: { preset: { name: string, body: Object } } }} request
 * @returns 
 */
export async function POST ({ request }) {
    const [_preset] = Object.entries(await request.json());
    console.log('/api/save-preset // [NEW PRESET SAVED]',_preset);
    fs.writeFileSync(`public/presets/${ _preset[0] }.json`, JSON.stringify({ ..._preset[1] }));

    return new Response(JSON.stringify({ 
        status: 200,
        message: 'File written!',
        [_preset[0]]: _preset[1]
    }));
}

