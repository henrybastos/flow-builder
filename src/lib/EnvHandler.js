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
         let rawEnvVar = this.hasEnvPlaceholder(_str);
         
         this._LOG_EVENT_('[IS GLOBAL]', _str, this.isEnvGlobal(_str), rawEnvVar);
         this._LOG_EVENT_('[IS RESPONSE PAYLOAD]', _str, this.isResponsePayload(_str), rawEnvVar);

         const envVar = this.resolveDotNotation(rawEnvVar, this.isEnvGlobal(_str) ? this.env : this.isResponsePayload(_str) ? this.response_payload : _env);
         this._LOG_EVENT_('[RAW ENV VAR]', rawEnvVar);
         this._LOG_EVENT_('[LOCA ENV]', _env);
         this._LOG_EVENT_('[RES PAYLOAD]', this.response_payload);
         this._LOG_EVENT_('[ENV VAR]', envVar);

         if (typeof envVar === 'string') {
            if (this.hasEnvPlaceholder(envVar)) {
               this._LOG_EVENT_('[RUN AGAIN]', envVar);
               return this.checkPlaceholders(envVar, _env);
            } else if (_str.split(/%.*%/g).filter(v => v).length > 0) {
               this._END_LOG_EVENT_(_str.replaceAll(/%.*%/gi, envVar));
               return _str.replaceAll(/%.*%/gi, envVar);
            }
         }

         this._END_LOG_EVENT_('[RETURN ENV VAR]', envVar);
         return envVar;
      } else {
         this._END_LOG_EVENT_('[RETURN RAW]', _str);
         return _str;
      }
   }

   static _LOG_EVENT_ (..._items) {
      if (this.log_events) {
         console.log('[ENV_HANLDER]', ..._items);
      }
   }

   static _BEGIN_LOG_EVENT_ () {
      if (this.log_events) {
         console.log('\n-----[ENV_HANLDER • EVENT_BEGIN]-----');
      }
   }

   static _END_LOG_EVENT_ (..._items) {
      if (this.log_events) {
         console.log('[ENV_HANLDER]', ..._items, '\n-----[ENV_HANLDER • EVENT_END]-----\n');
      }
   }

   static hasEnvPlaceholder (_str) {
      return _str.match(/(?<=%).*(?=%)/g)?.[0].replace(/\$\$(env|res)\./g, '');
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