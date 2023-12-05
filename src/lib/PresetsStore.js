import { writable } from "svelte/store";
import { initStruct } from "./PayloadStore";

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

         if (_flag_saveToLocalStorage) { localStorage.setItem('presets', JSON.stringify(_presets)) }
         return _presets;
      })
   }

   function _fix_fixNullConfigForAll () {
      update(_presets => {
         return Object.entries(_presets).map(([_preset_name, _preset_payload]) => {
            return ({
               [_preset_name]: {
                  ..._preset_payload,
                  config: { ...initStruct.config }
               }
            })
         })
      })
   }

   function savePreset (_preset_flow) {
      // Prevents invalid already closed web socket endpoints
      Object.values(_preset_flow)[0].config.ws_endpoint = '';

      if (typeof _preset_flow === 'object') {
         update((_presets) => {
            _presets = {..._presets, ..._preset_flow};

            if (_flag_saveToLocalStorage) { localStorage.setItem('presets', JSON.stringify(_presets)) }
            return _presets;
         });
      }
   }

   function removePreset (_preset_name) {
      return update((_presets) => {
         delete _presets[_preset_name];

         if (_flag_saveToLocalStorage) { localStorage.setItem('presets', JSON.stringify(_presets)) }
         return _presets;
      })
   }

   async function savePresetToLibrary () {
      const res = await fetch('/api/save-to-library', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            game: 'Rocket League'
         })
      });
      
      console.log(res);
      let _res = await res.json();
      console.log('Done', _res);
   }

   return {
      subscribe,
      _fix_fixNullConfigForAll,
      loadPresets: (_presets) => set(_presets),
      clearPresets: () => set({}),
      savePreset,
      renamePreset,
      removePreset,
      savePresetToLibrary
   }
}

export const FLOW_PRESETS = createPresetsStore();
export const CURRENT_PRESET_NAME = writable('');