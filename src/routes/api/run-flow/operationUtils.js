import { EnvHandler } from "$lib/EnvHandler";

export function removeKeyFlags (key) {
   const flags = [
       '@expose:', 
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

export function fillUndefinedQueryMembers (query, obj) {
    query.split('.').reduce((a,b) => {
        console.log(`Checking ${a} ...`);
        if (eval(`!obj.${a}`)) { 
            eval(`obj.${a} = {}`) 
        }

        console.log(`Checking ${a}.${b} ...`);
        if (eval(`!obj.${a}.${b}`)) { 
            eval(`obj.${a}.${b} = {}`) 
        }
        console.log(eval(`obj.${a}.${b}\n`)); 
        return `${a}.${b}`; 
    })
    return obj;
}