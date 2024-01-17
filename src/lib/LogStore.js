import { writable } from "svelte/store";
import { genUUID } from "./utils";

export const TAGS = {
   info: {
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
   },
   warning: {
      type: 'warning',
      label: '[WARNING]'
   },
   timer: {
      type: 'timer',
      label: '[ELAPSED TIME]'
   },
   running: {
      type: 'running',
      label: '[RUNNING]'
   }
}

function createLogger () {
   const initStruct = {
      messages: {}
   }

   const { subscribe, update, set } = writable(initStruct);

   /**
    * Logs a message to the Payload Modal Console Screen.
    * @param {string} _message 
    * @param {'info'|'success'|'error'|'warning'} _tag 
    */
   function logMessage (_message, _tag) {
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

         const updated_log = {
            ..._log,
            messages: {
               ..._log.messages,
               ...new_message
            }
         };

         localStorage.setItem('logs', JSON.stringify(updated_log));

         return updated_log;
      })
   }

   /**
    * Loads logs to the Local Storage.
    * @param {string|Object} _logs 
    * @returns 
    */
   function loadLogs (_logs) {
      if (_logs) {
         switch (typeof _logs) {
            case 'string':
               localStorage.setItem('logs', _logs);
               set(JSON.parse(_logs));
               break;
            case 'object':
               localStorage.setItem('logs', JSON.stringify(_logs));
               set(JSON.parse(_logs));
               break;
         }
      }
   }

   /**
    * Clears the logs from Local Storage.
    */
   function clearLogs () {
      localStorage.removeItem('logs');
      set(initStruct);
   }

   return {
      subscribe,
      logMessage,
      loadLogs,
      clearLogs
   }
}

export const LOGGER = createLogger();