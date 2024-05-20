import sqlite3 from 'sqlite3';

const DATABASE_FILENAME = 'src/database/data.db';

export async function POST ({ request }) {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   const req = await request.json();
   let responseErrorMessage;
   let newPresetID;

   return await new Promise((resolve) => {
      db.serialize(() => {
         const propertiesNotFound = [
            ( !req?.name && 'Name' ),
            ( !req?.payload && 'Payload' )
         ].filter(v => v);
         // console.log(propertiesNotFound);

         db.run(`
         CREATE TABLE IF NOT EXISTS presets (
            id VARCHAR(64) PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            created_at DATE DEFAULT CURRENT_DATE,
            updated_at DATE DEFAULT CURRENT_DATE,
            payload TEXT NOT NULL
         );`);
            
         if (propertiesNotFound.length > 0)  {
            responseErrorMessage = `[SQLITE::POST / ERROR] ${ propertiesNotFound.join(' and ') } required but not found.`;
            console.log('[SQLITE/POST] Request:', req);
         } else {
            newPresetID = crypto.randomUUID();
            db.prepare('INSERT INTO presets VALUES (?, ?, ?, ?, ?, ?)')
               .run(
                  newPresetID, 
                  req.name, 
                  req.description || '', 
                  new Date().toLocaleDateString('pt-BR'),
                  `${ new Date().toLocaleDateString('pt-BR')} - ${new Date().toLocaleTimeString('pt-BR') }`,
                  req.payload
               , (error) => {
                  if (error) {
                     responseErrorMessage = `[SQLITE::POST / ERROR] ${ error?.message }`;
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
            message: responseErrorMessage || '[SQLITE::POST / SUCCESS] Item added',
            code: responseErrorMessage ? 1 : 0,
            item: {
               id: newPresetID,
               ...req
            }
         }, null, 3)));
      });
   })
}

export async function GET () {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   let allPresets = [];
   let responseErrorMessage;

   return await new Promise((resolve) => {
      db.serialize(() => {
         db.each('SELECT * FROM presets', (error, row) => {
            if (row) {
               allPresets.push(row);
            }
   
            if (error) {
               console.error('[SQLITE - GET] No items found.');
            }
         })
      })
   
      db.close(() => {
         // console.log('[SQLITE] All presets:', allPresets);
         resolve(new Response(JSON.stringify(allPresets, null, 3)));
      });
   })
}

export async function DELETE () {
   const db = new sqlite3.Database(DATABASE_FILENAME);
   let responseMessage;

   return await new Promise((resolve) => {
      db.serialize(() => {
         db.run('DROP TABLE IF EXISTS presets');
         responseMessage = '[SQLITE::DELETE] Table presets deleted.';
      })
   
      db.close(() => {
         resolve(new Response(responseMessage));
      });
   })

}