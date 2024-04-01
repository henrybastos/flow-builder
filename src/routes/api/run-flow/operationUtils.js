import { EnvHandler } from "$lib/EnvHandler";

export function removeKeyFlags (key) {
   const flags = [
       '@exposed:', 
       '@scoped:',
       '@query:',
       '@private:'
   ];

   flags.forEach(flag => key = key.replace(flag, ''));
   return key;
}

export function replaceEnvPlaceholders (_operation, _env) {
   for (const [_input_name, _input_value] of Object.entries(_operation)) {
       if (EnvHandler.ENV_VARIABLES_INPUT_ALLOWLIST.includes(_input_name)) {
           _operation[_input_name] = EnvHandler.checkPlaceholders(_input_value, _env);
           console.log(_operation[_input_name]);
       }
   }
}