export class EnvHandler {
   static log_events = false;

   static ENV_VARIABLES_INPUT_ALLOWLIST = [
      'target',
      'trigger_target',
      'picker_target',
      'color',
      'key',
      'mod_keys',
      'keys',
      'response_slot',
      'time',
      'value',
      'filename',
      'expression',
      'page_id'
   ];

   static setGlobalEnv (_env) {
      this.env = _env;
   }

   static setResponsePayload (_response_payload) {
      this.response_payload = _response_payload;
   }

   static checkPlaceholders (_str, _env) {
      this._BEGIN_LOG_EVENT_();
      this._LOG_EVENT_('[START]', _str, _env);

      const placeholders = this.hasEnvPlaceholder(_str);
      console.log('[PLACEHOLDERS]', placeholders);

      if (placeholders) {
         const result = placeholders?.map(placeholder => {
            const cleanedPlaceholder = this.trimAbsolutePlaceholders(placeholder);
            const chosenEnv = this.chooseEnv(placeholder, _env);
            let envVar = this.resolveDotNotation(cleanedPlaceholder, chosenEnv);

            if (typeof envVar === 'string' && this.hasEnvPlaceholder(envVar)) {
               envVar = this.checkPlaceholders(envVar, _env);
            }

            // console.log('[DEBUG #00 - CHOSEN ENV]', chosenEnv);
            // console.log('[DEBUG #01 - STR]', _str);
            // console.log('[DEBUG #02 - ENV VAR]', envVar);
            // console.log('[DEBUG #03 - PLACEHOLDERS]', placeholder);
            // console.log('[DEBUG #03 - CLEANED PLACEHOLDERS]', cleanedPlaceholder);

            if (typeof envVar === 'number') {
               envVar = envVar.toString();
            }

            if (typeof envVar === 'string') {
               // eslint-disable-next-line no-useless-escape
               const newPlaceholder = new RegExp(`(@@|@@\\$\\$(env|res):)${ this.trimAbsolutePlaceholders(placeholder) }@`, 'g');
               console.log('[NEW PLACEHOLDER]', _str.replaceAll(newPlaceholder, envVar));
               return _str = _str.replaceAll(newPlaceholder, envVar);
            }
            
            console.log('[NOT STRING]', envVar);
            return envVar;
         });

         console.log('[DEBUG #05 - RESULT]', result, _env);
         return result.slice(-1)[0];
      } else {
         return _str;
      }
   }

   static chooseEnv(_str, _relative_env) {
      if (this.isEnvGlobal(_str)) {
         // console.log('[GLOBAL ENV]', _str, this.env);
         return this.env;
      } 

      if (this.isResponsePayload(_str)) {
         // console.log('[RESPONSE ENV]', _str, this.response_payload);
         return this.response_payload;
      }

      // console.log('[RELATIVE ENV]', _str, _relative_env);
      return _relative_env;
   }

   static _LOG_EVENT_ (..._items) {
      if (this.log_events) {
         console.log('[ENV_HANDLER]', ..._items);
      }
   }

   static _BEGIN_LOG_EVENT_ () {
      if (this.log_events) {
         console.log('\n-----[ENV_HANDLER • EVENT_BEGIN]-----');
      }
   }

   static _END_LOG_EVENT_ (..._items) {
      if (this.log_events) {
         console.log('[ENV_HANDLER]', ..._items, '\n-----[ENV_HANDLER • EVENT_END]-----\n');
      }
   }

   static hasEnvPlaceholder (_str) {
      // Gets all placeholders
      const placeholders = _str.match(/(?<=@@)([^@]+)(?=@)/g);

      if (!placeholders) {
         return null;
      }

      /*
      if (placeholders.length > 2) {
         // Gets all even placeholders 
         // e.g.: In "@var_1@/@var_2@" it would return ["@@var_1@", "/", "@@var_2@"], and the "/" its not desired, its a subproduct.
         let evenPlaceholders = placeholders?.filter((w,i) => i % 2 == 0 && w);
         // console.log('evenPlaceholders', evenPlaceholders);
      }
      */

      // Removes the "$$env" and "$$res"
      return Array.from(new Set(placeholders));
   }

   static trimAbsolutePlaceholders (_str) {
      return _str.replace(/\$\$(env|res):/g, '');
   }
   
   static isEnvGlobal (_str) {
      return _str.match(/\$\$env:/g) !== null;
   }

   static isResponsePayload (_str) {
      return _str.match(/\$\$res:/g) !== null;
   }
   
   static resolveDotNotation (_str, _env) {
      // console.log(_env);
      return [_env, ..._str.split('.')]?.reduce((a,b) => a?.[b]) ?? 'invalid_env_var';
   }
}