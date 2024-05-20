import sqlite3 from 'sqlite3';

const DATABASE_FILENAME = 'src/database/data.db';

export async function GET ({ params }) {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   let selectedPreset;
   console.log(params, params.id, parseInt(params.id));

   return await new Promise((resolve) => {
      db.serialize(() => {
         db.prepare('SELECT * FROM presets WHERE id = ?').get(params.id,
            (error, row) => {
               if (error) {
                  responseErrorMessage = '[SQLITE::GET / ERROR] No items found'
               } else if (row) {
                  selectedPreset = row;
               }
         }).finalize();
      })
   
      db.close(() => {
         if (selectedPreset) {
            console.log('[SQLITE::GET] Selected preset:', selectedPreset);
            resolve(new Response(JSON.stringify(selectedPreset, null, 3)));
         }
      });
   })
}

export async function DELETE ({ params }) {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   let responseMessage;

   return await new Promise((resolve) => {
      db.serialize(() => {
         db.prepare('DELETE FROM presets WHERE id = ?')
            .run(params.id)
            .finalize();
         responseMessage = `[SQLITE::DELETE] Item ${ params.id } deleted.`;
      })
   
      db.close(() => {
         resolve(new Response(responseMessage));
      });
   })

}

export async function PATCH ({ params, request }) {
   const newData = await request.json();
   console.log(newData);
   const db = new sqlite3.Database(DATABASE_FILENAME);
   const updatedPayload = {
      name: newData.name,
      description: newData.description || '',
      updated_at: `${ new Date().toLocaleDateString('pt-BR')} - ${new Date().toLocaleTimeString('pt-BR') }`,
      payload: newData.payload
   }

   return await new Promise((resolve) => {
      db.serialize(() => {
         db.prepare(`
         UPDATE presets 
         SET
            name = ?,
            description = ?,
            updated_at = ?,
            payload = ?
         WHERE id = ?
         `)
            .run(
               updatedPayload.name,
               updatedPayload.description,
               updatedPayload.updated_at,
               updatedPayload.payload,
               params.id
            )
            .finalize();
      })
   
      db.close(() => {
         resolve(new Response(JSON.stringify({
            message: `[SQLITE::PATCH] Item ${ params.id } updated.`,
            payload: updatedPayload
         }, null, 3)));
      });
   })
}