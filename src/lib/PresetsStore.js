import { writable } from "svelte/store";

let _flag_saveToLocalStorage = true;

function createPresetsStore () {
   const { subscribe, update, set } = writable({});

   /**
    * 
    * @param {string} _old_preset_name 
    * @param {string} _new_preset_name 
    * @param {Object} _preset_body 
    */
   function renamePreset (_old_preset_name, _new_preset_name) {
      update(_presets => {
         _presets[_new_preset_name] = _presets[_old_preset_name];
         delete _presets[_old_preset_name];

         if (_flag_saveToLocalStorage) { localStorage.setItem('presets', JSON.stringify(_presets)) };
         return _presets;
      })
   }

   return {
      subscribe,
      loadPresets: (_presets) => set(_presets),
      savePreset: (_preset_flow) => {
         // Prevents invalid already closed web socket endpoints
         // Object.values(_preset_flow)[0].config.ws_endpoint = '';

         if (typeof _preset_flow === 'object') {
            update((_presets) => {
               _presets = {..._presets, ..._preset_flow};

               if (_flag_saveToLocalStorage) { localStorage.setItem('presets', JSON.stringify(_presets)) };
               return _presets;
            });
         }
      },
      renamePreset,
      removePreset: (_preset_name) => update((_presets) => {
         delete _presets[_preset_name];

         if (_flag_saveToLocalStorage) { localStorage.setItem('presets', JSON.stringify(_presets)) };
         return _presets;
      }),
      clearPresets: () => set({})
   }
}

export const FLOW_PRESETS = createPresetsStore();
export const CURRENT_PRESET_NAME = writable('');