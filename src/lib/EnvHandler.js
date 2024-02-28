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

      if (this.hasEnvPlaceholder(_str)) {
         let rawEnvVars = this.hasEnvPlaceholder(_str);
         this._LOG_EVENT_('[RAW ENV VARS]', rawEnvVars);

         const result = rawEnvVars?.map(raw_env_var => {
            this._LOG_EVENT_('[IS GLOBAL]', this.isEnvGlobal(_str));
            this._LOG_EVENT_('[IS RESPONSE PAYLOAD]', this.isResponsePayload(_str));
   
            let envVar = this.resolveDotNotation(this.trimAbsolutePlaceholders(raw_env_var), this.chooseEnv(raw_env_var, _env));
            this._LOG_EVENT_('[ENV VAR]', envVar);
   
            if (typeof envVar === 'string') {
               if (this.hasEnvPlaceholder(envVar)) {
                  this._LOG_EVENT_('[RUN AGAIN]', envVar);
                  envVar = this.checkPlaceholders(envVar, _env);
               } 
            }
            this._LOG_EVENT_('[STR]', _str, this.needsStringReplacement(_str));

            if (this.needsStringReplacement(_str) && typeof envVar === 'string') {
               // eslint-disable-next-line no-useless-escape
               const newPlaceholder = new RegExp(`(%|%\\$\\$(env|res)\.)${ this.trimAbsolutePlaceholders(raw_env_var) }%`, 'g');
               this._LOG_EVENT_('[REPLACE ALL]', _str.replaceAll(newPlaceholder, envVar), newPlaceholder, envVar);
               return _str = _str.replaceAll(newPlaceholder, envVar);
            }

            return envVar;
         });

         this._END_LOG_EVENT_('[RETURN ENV VARS]', result.slice(-1)[0]);
         return result.slice(-1)[0];
      } else {
         this._END_LOG_EVENT_('[RETURN RAW]', _str);
         return _str;
      }
   }

   static chooseEnv(_str, _relative_env) {
      if (this.isEnvGlobal(_str)) {
         this._LOG_EVENT_('[GLOBAL ENV]', _str, this.env);
         return this.env;
      } 

      if (this.isResponsePayload(_str)) {
         this._LOG_EVENT_('[RESPONSE ENV]', _str, this.response_payload);
         return this.response_payload;
      }

      this._LOG_EVENT_('[RELATIVE ENV]', _str, _relative_env);
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
      const placeholders = _str.match(/(?<=%)(.*?)(?=%)/g);

      if (!placeholders) {
         return null;
      }

      // Gets all even placeholders 
      // e.g.: In "%var_1%/%var_2%" it would return ["%var_1%", "/", "%var_2%"], and the "/" its not desired, its a subproduct.
      let evenPlaceholders = placeholders?.filter((w,i) => i % 2 == 0 && w);
      // console.log('evenPlaceholders', evenPlaceholders);

      // Removes the "$$env" and "$$res"
      return evenPlaceholders;
   }

   static trimAbsolutePlaceholders (_str) {
      return _str.replace(/\$\$(env|res)\./g, '');
   }
   
   static isEnvGlobal (_str) {
      return _str.match(/\$\$env\./g) !== null;
   }

   static isResponsePayload (_str) {
      return _str.match(/\$\$res\./g) !== null;
   }

   static needsStringReplacement (_str) {
      console.log('[ENV_HANDLER]', _str);
      return _str.match(/(?<=%)(.*?)(?=%)/g)?.filter((w, i) => i % 2 == 0 && w)?.length > 0;
   }
   
   static resolveDotNotation (_str, _env) {
      // console.log(_env);
      return [_env, ..._str.split('.')]?.reduce((a,b) => a?.[b]) || 'invalid_env_var';
   }
}