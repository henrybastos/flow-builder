import fs from 'fs';

export async function GET ({ url }) {
    const presetName = url.searchParams.get('preset-name');
    const presetBody = fs.readFileSync(`public/presets/${ presetName }`, { encoding: 'utf-8' });
    
    return new Response(JSON.stringify({ 
        [presetName]: JSON.parse(presetBody)
    }));
}