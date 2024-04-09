export async function load({ params }) {
   try {
      const flowBlocksFile = await import('$lib/flow-blocks/FlowBlocks.ts');
      console.log('[SYS] File FlowBlocks.ts found.');
      return { flowBlocks: flowBlocksFile.FlowBlocks};
   } catch (err) {
      console.log('[ERROR] File FlowBlocks.ts not found. Create a new one and refresh the page.');
      return { missingFlowBlocksFile: true};
      // fs.writeFileSync('./src/lib/flow-blocks/FlowBlocks.ts', 'export const FlowBlocks = [];');
   }
}