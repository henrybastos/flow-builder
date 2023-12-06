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
      try {
         Object.values(_preset_flow)[0].config.ws_endpoint = '';
      } catch (err) {
         _preset_flow.config = structuredClone(initStruct.config);
         console.error('[ERROR :: NO WS FOUND]', err, '\nFixing config...');
      };

      if (typeof _preset_flow === 'object') {
         update((_presets) => {
            _presets = {
               ..._presets, 
               ..._preset_flow
            };

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

   async function savePresetToLibrary (_preset) {
      const res = await fetch('/api/save-preset', {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify(_preset)
      });
      
      console.log(res);
      let _res = await res.json();
      console.log('Done', _res);
   }

   async function loadPresetFromLibrary (_preset_name) {
      const response = await fetch('/api/load-preset?' + new URLSearchParams({ 'preset-name': _preset_name }), {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      })
      return await response.json();
   }

   async function loadAllPresetsFromLibrary () {
      const response = await fetch('/api/load-all-presets', {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json'
         }
      });

      const presets = await response.json();

      for(const [preset, preset_payload] of Object.entries(presets)) {
         // console.log(preset_payload);
         savePreset(preset_payload);
         _fix_fixNullConfigForAll();
      }

      return presets;
   }

   return {
      subscribe,
      _fix_fixNullConfigForAll,
      loadPresets: (_presets) => set(_presets),
      clearPresets: () => set({}),
      savePreset,
      renamePreset,
      removePreset,
      savePresetToLibrary,
      loadPresetFromLibrary,
      loadAllPresetsFromLibrary
   }
}

export const FLOW_PRESETS = createPresetsStore();
export const CURRENT_PRESET_NAME = writable('');