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
                  responseErrorMessage = '[SQLITE/GET :: ERROR] No items found'
               } else if (row) {
                  selectedPreset = row;
               }
         }).finalize();
      })
   
      db.close(() => {
         if (selectedPreset) {
            console.log('[SQLITE/GET] Selected preset:', selectedPreset);
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
         responseMessage = `[SQLITE/DELETE] Item ${ params.id } deleted.`;
      })
   
      db.close(() => {
         resolve(new Response(responseMessage));
      });
   })

}