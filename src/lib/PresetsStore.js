import { writable } from "svelte/store";

function createPresetsStore () {
   const { subscribe, update, set } = writable({});

   return {
      subscribe,
      savePreset: (_preset_name, _preset_flow) => {
         
      },
      clearPresets,
      removePreset
   }
}