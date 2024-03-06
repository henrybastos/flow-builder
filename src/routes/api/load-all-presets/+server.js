import fs from 'fs';

export async function GET () {
    const foundPresets = fs.readdirSync('public/presets');
    
    if (foundPresets) {
        const presetList = foundPresets.map(preset_name => {
            return [
                preset_name, 
                JSON.parse(fs.readFileSync(`public/presets/${ preset_name }`, { encoding: 'utf-8' }))
            ];
        });

        return new Response(JSON.stringify(Object.fromEntries(presetList)));
    }
    return new Response(JSON.stringify({ error: 'No public folder found' }));
}