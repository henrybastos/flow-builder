async function set_env ({ env_query, value }, _env) {
    eval(`_env.${ env_query } = value`);
    console.log('ENV', _env);
    return _env;
}

export default set_env;