import fs from 'fs';

/**
 * 
 * @param {{request: { preset: { name: string, body: Object } } }} request
 * @returns 
 */
export async function POST ({ request }) {
    const { name, body } = await request.json();
    fs.writeFileSync(`public/presets/${ name }.json`, JSON.stringify({ preset: body }));

    return new Response(JSON.stringify({ 
        status: 200,
        message: 'File written!'
    }));
}