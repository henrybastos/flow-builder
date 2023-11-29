const envPlaceholder = {
    start: '%',
    end: '%'
}

const globalEnvPlaceholder = "\\$\\$";

const placeholderMatchRegExp = new RegExp(`${ envPlaceholder.start }.*${ envPlaceholder.end }`, 'g');
const placeholderReplaceRegExp = new RegExp(`(${ envPlaceholder.start }|${ envPlaceholder.end })`, 'g');
const globalPlaceholderMatchRegExp = new RegExp(`${ globalEnvPlaceholder }env.`, 'g');

export function filterKeys (_obj, _query) {
    for (let key of Object.keys(_obj)) {
        if (_query.includes(key) && key !== 'value') {
            // console.log(`Forbidden key: ${ key }`);
            delete _obj[key];
        } else {
            if (typeof _obj[key] === 'object') {
                filterKeys(_obj[key], _query);
            }
        }
    }
}

// Returns an object with only the desired keys.
export function filterDesiredKeys (_obj, _keys) {
    let clone = structuredClone(_obj);

    for (let key of Object.keys(clone)) {
        if (_keys.includes(key)) {
            if (typeof key === 'object') {
                clone = filterObject(key, _keys);
            }
        } else {
            delete clone[key];
        }
    }
    return clone;
}

export function deleteEmptyObjs (_obj) {
    for (let key of Object.keys(_obj)) {
        if (typeof _obj[key] === 'object') {
            if (Object.keys(_obj[key]).length === 0) {
                delete _obj[key];
            } else {
                deleteEmptyObjs(_obj[key]);
            }
        }
    }
}

export function filterObject (_obj, _query) {
    let _buffer = structuredClone(_obj);
    filterKeys(_buffer, _query);
    deleteEmptyObjs(_buffer);
    return _buffer;
}

export function snakeCaseToPascalCase (_string, _spaced = false) {
    if (_spaced) {
        return _string.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    } else {
        return _string.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('_');
    }
}

export function convertToSnakeCase (_string) {
    return _string.toLowerCase().replaceAll(/[\s-]/g, '_');
}

export function checkForEnvPlaceholder (_str) {
    return _str.match(placeholderMatchRegExp);
}

export function checkForGlobalEnvPlaceholder (_str) {
    // console.log(`[CHECK GLOBAL]: ${ _str } : ${ _str.match(globalPlaceholderMatchRegExp) }`);
    return _str.match(globalPlaceholderMatchRegExp);
    // const trimmed_str = trimEnvPlaceholder(_str).replace(globalPlaceholderMatchRegExp, '');
    // console.log(`[TRIMMED]: ${ trimmed_str }`);
    // if (trimmed_str) {
    //     checkEnvVars(_env.match(new RegExp(`(?<=${ globalEnvPlaceholder }env\.).*`, 'g')[0]), trimmed_str)
    // } else {
    //     return null;
    // }
}

export function trimEnvPlaceholder (_str) {
    return _str.match(placeholderMatchRegExp)[0].replaceAll(placeholderReplaceRegExp, '').replace(globalPlaceholderMatchRegExp, '');
}

export function resolveDotNotation (_obj, _str) {
    return [_obj, ..._str.split('.')].reduce((a,b) => a[b]);
}

export function replaceEnvPlaceholder (_str, _env) {
    let envVariable = resolveDotNotation(_env, _str);
    return _str.match(placeholderMatchRegExp) ? replaceEnvPlaceholder(envVariable, _env) : envVariable;
}

export function checkEnvVars (_field_value, _env) {
    let value = _field_value.replace(globalEnvPlaceholder, '');
    console.log(value);
    // console.log(`[TRIMMED]: ${ value }`);
    
    // value = _env_prefix ? `${_env_prefix}.${value}` : value;
    // console.log(`[APPENDED]: ${ value }`);

    if (checkForEnvPlaceholder( value )) {
        return replaceEnvPlaceholder(trimEnvPlaceholder(value), _env);
    }

    return _field_value;
}

export function genUUID () {
    return Math.random().toString().slice(2);
}

/**
 * Checks if click was on any of the elements with the guides
 * @param {Array<string>} _guides 
 * @param {string} _target 
 * @returns 
 */
export function checkClickOnGuideIDs (_guides, _target) {
    return _guides.includes(_target.dataset.guideId);
}