import fs from 'fs';

export function POST ({ preset }) {
    // fs.writeFileSync('/public/presets/test.json', JSON.stringify({ name: 'Henry' }));
    return new Response(preset);
}