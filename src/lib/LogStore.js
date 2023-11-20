import { writable } from "svelte/store";
import { genUUID } from "./utils";

export const TAGS = writable({
   system: {
      type: 'info',
      label: '[SYS]'
   },
   success: {
      type: 'success',
      label: '[SUCCESS]'
   },
   error: {
      type: 'error',
      label: '[ERROR]'
   }
})

function createLogger () {
   const initStruct = {
      messages: {}
   }

   const { subscribe, update, set } = writable(initStruct);

   return {
      subscribe,
      /**
       * Logs a message to the Payload Modal Console
       * @param {string} _message 
       * @param {'system'|'success'} _tag 
       */
      logMessage: (_message, _tag) => {
         update(_log => {
            const new_message = {
               [genUUID()]: {
                  message: _message,
                  tag: {
                     type: _tag.type,
                     label: _tag.label
                  },
                  date: new Date().toLocaleDateString(),
                  time: new Date().toLocaleTimeString()
               }
            };

            return {
               ..._log,
               messages: {
                  ..._log.messages,
                  ...new_message
               }
            }
         })
      }
   }
}

export const LOGGER = createLogger();