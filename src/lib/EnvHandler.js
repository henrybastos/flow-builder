export class EnvHandler {
   static log_events = true;

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
            this._LOG_EVENT_('[IS GLOBAL]', _str, this.isEnvGlobal(_str), raw_env_var);
            this._LOG_EVENT_('[IS RESPONSE PAYLOAD]', _str, this.isResponsePayload(_str), raw_env_var);
   
            const envVar = this.resolveDotNotation(raw_env_var, this.isEnvGlobal(_str) ? this.env : this.isResponsePayload(_str) ? this.response_payload : _env);
            this._LOG_EVENT_('[ENV VAR]', envVar);
   
            if (typeof envVar === 'string') {
               if (this.hasEnvPlaceholder(envVar)) {
                  this._LOG_EVENT_('[RUN AGAIN]', envVar);
                  return this.checkPlaceholders(envVar, _env);
               } else if (_str.split(/%.*%/g).filter(v => v).length > 0) {
                  const newPlaceholder = new RegExp(`%${ raw_env_var }%`, 'g');
                  return _str = _str.replaceAll(newPlaceholder, envVar);
               }
            }
         });

         this._END_LOG_EVENT_('[RETURN ENV VARS]', result.slice(-1)[0]);
         return result.slice(-1)[0];
      } else {
         this._END_LOG_EVENT_('[RETURN RAW]', _str);
         return _str;
      }
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
      const placeholders = _str.match(/(?<=%).[^%]*(?=%)/g);

      // Gets all even placeholders 
      // e.g.: In "%var_1%/%var_2%" it would return ["%var_1%", "/", "%var_2%"], and the "/" its not desired, its a subproduct.
      let evenPlaceholders = placeholders?.filter((v,i) => i % 2 == 0 && v);
      console.log('evenPlaceholders', evenPlaceholders);

      // Removes the "$$env" and "$$res"
      return evenPlaceholders?.map(placeholder => placeholder.replace(/\$\$(env|res)\./g, ''));
   }
   
   static isEnvGlobal (_str) {
      return _str.match(/\$\$env\./g) !== null;
   }

   static isResponsePayload (_str) {
      return _str.match(/\$\$res\./g) !== null;
   }
   
   static resolveDotNotation (_str, _env) {
      console.log(_env);
      return [_env, ..._str.split('.')]?.reduce((a,b) => a?.[b]) || 'invalid_env_var';
   }
}