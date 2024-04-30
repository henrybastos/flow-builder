import sqlite3 from 'sqlite3';

const DATABASE_FILENAME = 'src/database/data.db';

export async function GET ({ params }) {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   let allPresets = [];
   console.log(params, params.id, parseInt(params.id));

   return await new Promise((resolve) => {
      db.serialize(() => {
         db.prepare('SELECT * FROM presets WHERE id = ').get((error, row) => {
            console.log(row);
         }).finalize();

         // db.prepare('SELECT * FROM presets WHERE id = ?')
         //    .get(parseInt(params.id), (error, row) => {
         //       if (error) {
         //          responseErrorMessage = `[SQLITE - GET // ERROR] ${ error?.message }`;
         //       } else if (row) {
         //          allPresets.push(row);
         //       } else {
         //          responseErrorMessage = '[SQLITE - GET // ERROR] No items found';
         //       }
         //    }, (error) => {
         //       console.error('[SQLITE CONNECTION ERROR]', error);
         //    })
         //    .finalize();
      })
   
      db.close(() => {
         console.log('[SQLITE] All presets:', allPresets);
         resolve(new Response(JSON.stringify(allPresets, null, 3)));
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
         responseMessage = `[SQLITE - DELETE] Item ${ params.id } deleted.`;
      })
   
      db.close(() => {
         resolve(new Response(responseMessage));
      });
   })

}