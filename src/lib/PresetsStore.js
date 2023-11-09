import { writable } from "svelte/store";

function createPresetsStore () {
   const { subscribe, update, set } = writable({});

   return {
      subscribe,
      loadPresets: (_presets) => set(_presets),
      savePreset: (_preset_flow) => {
         if (typeof _preset_flow === 'object') {
            update((_presets) => {
               _presets = {..._presets, ..._preset_flow};
               localStorage.setItem('presets', JSON.stringify(_presets));
               return _presets;
            });
         }
      },
      removePreset: (_preset_name) => update((_presets) => {
         delete _presets[_preset_name];
         localStorage.setItem('presets', JSON.stringify(_presets));
         return _presets;
      }),
      clearPresets: () => set({})
   }
}

export const FLOW_PRESETS = createPresetsStore();