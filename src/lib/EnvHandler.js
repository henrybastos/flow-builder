export class EnvHandler {
   static setGlobalEnv (_env) {
      this.env = _env;
   }

   static checkPlaceholders (_str, _env) {
      console.log('[ENV_HANLDER] [START]', _str, _env);
      if (this.hasEnvPlaceholder(_str)) {
         let rawEnvVar = this.hasEnvPlaceholder(_str);

         console.log('[ENV_HANLDER] [IS GLOBAL]', _str, this.isEnvGlobal(_str), rawEnvVar);
         const envVar = this.resolveDotNotation(rawEnvVar, this.isEnvGlobal(_str) ? this.env : _env);
         console.log('[ENV_HANLDER] [ENV VAR]', envVar);

         if (typeof envVar === 'string') {
            if (this.hasEnvPlaceholder(envVar)) {
               console.log('[ENV_HANLDER] [RUN AGAIN]', envVar);
               return this.checkPlaceholders(envVar, _env);
            } else if (_str.split(/%.*%/g).filter(v => v).length > 0) {
               return _str.replaceAll(/%.*%/gi, envVar);
            }
         }
         console.log('[ENV_HANLDER] [RETURN]', envVar);
         return envVar;
      }
   }

   static hasEnvPlaceholder (_str) {
      return _str.match(/(?<=%).*(?=%)/g)?.[0].replace(/\$\$env\./g, '');
   }

   static isEnvVar (_str) {
      return _str.match(/%.*%/g) !== null;
   }
   
   static isEnvGlobal (_str) {
      return _str.match(/\$\$env\./g) !== null;
   }
   
   static resolveDotNotation (_str, _env) {
      return [_env, ..._str.split('.')]?.reduce((a,b) => a?.[b]) || 'invalid_env_var';
   }
}