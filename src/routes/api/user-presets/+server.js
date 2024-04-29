import sqlite3 from 'sqlite3';

const DATABASE_FILENAME = 'src/database/data2.db';

export async function POST ({ request }) {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   const req = await request.json();
   let responseErrorMessage;

   return await new Promise((resolve) => {
      db.serialize(() => {
         db.run(`
         CREATE TABLE IF NOT EXISTS presets (
            id INTEGER PRIMARY KEY, 
            name TEXT NOT NULL, 
            description TEXT, 
            date DATE DEFAULT CURRENT_DATE
         );`);
            
         if (!req?.name && !req?.description)  {
            responseErrorMessage = '[SQLITE - POST // ERROR] NAME and DESCRIPTION are required, but were not found.';
         } else if (!req?.name) {
            responseErrorMessage = '[SQLITE - POST // ERROR] NAME is required, but was not found.';
         } else if (!req?.description) {
            responseErrorMessage = '[SQLITE - POST // ERROR] DESCRIPTION is required, but was not found.';
         } else {
            db.prepare('INSERT INTO presets VALUES (?, ?, ?, ?)')
               .run(
                  parseInt(Math.random().toString().substring(2, 8)), 
                  req.name, 
                  req.description, 
                  new Date().toLocaleDateString()
               , (error) => {
                  if (error) {
                     responseErrorMessage = `[SQLITE - POST // ERROR] ${ error?.message }`;
                  }
               })
               .finalize();
         }
      });

      if (responseErrorMessage) {
         console.log(responseErrorMessage);
      }
   
      db.close(() => {
         resolve(new Response(JSON.stringify({
            message: responseErrorMessage || '[SQLITE - POST // SUCCESS] Item added',
            code: responseErrorMessage ? 1 : 0,
            item: req
         }, null, 3)));
      });
   })
}

export async function GET ({ url }) {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   const id = url.searchParams.get('id');
   let allPresets = [];
   let responseErrorMessage;

   return await new Promise((resolve) => {
      db.serialize(() => {
         if (id) {
            db.prepare('SELECT * FROM presets WHERE id = ?')
               .get(id, (error, row) => {
                  if (error) {
                     responseErrorMessage = `[SQLITE - GET // ERROR] ${ error?.message }`;
                  } else if (row) {
                     allPresets.push(row);
                  } else {
                     responseErrorMessage = '[SQLITE - GET // ERROR] No items found';
                  }
               }, (error) => {
                  console.error('[SQLITE CONNECTION ERROR]', error);
               })
               .finalize();
            
         } else {
            db.each('SELECT * FROM presets', (error, row) => {
               if (row) {
                  allPresets.push(row);
               }
      
               if (error) {
                  console.error('[SQLITE - GET] No items found.');
               }
            })
         }
      })
   
      db.close(() => {
         console.log('[SQLITE] All presets:', allPresets);
         resolve(new Response(JSON.stringify(allPresets, null, 3)));
      });
   })
}

export async function DELETE ({ url }) {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   const id = url.searchParams.get('id');
   let responseMessage;

   return await new Promise((resolve) => {
      db.serialize(() => {
         if (id) {
            db.prepare('DELETE FROM presets WHERE id = ?')
               .run(id)
               .finalize();
            responseMessage = `[SQLITE - DELETE] Item ${ id } deleted.`;
         } else {
            db.run('DROP TABLE IF EXISTS presets');
            responseMessage = '[SQLITE - DELETE] Table presets deleted.';
         }
      })
   
      db.close(() => {
         console.log('[SQLITE] Database closed');
         resolve(new Response('All presets!'));
      });
   })

}