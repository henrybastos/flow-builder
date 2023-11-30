const envPlaceholder = {
    start: '%',
    end: '%'
}

const globalEnvPlaceholder = "\\$\\$";

export const placeholderMatchRegExp = new RegExp(`${ envPlaceholder.start }.*${ envPlaceholder.end }`, 'g');
export const placeholderReplaceRegExp = new RegExp(`(${ envPlaceholder.start }|${ envPlaceholder.end })`, 'g');
export const globalPlaceholderMatchRegExp = new RegExp(`${ globalEnvPlaceholder }env.`, 'g');

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

// checkEnvVars, checkForGlobalEnvPlaceholder, checkForEnvPlaceholder

export function checkEnvVars (_field_value, _env) {
    let value = _field_value.match(placeholderMatchRegExp)[0].replace(globalPlaceholderMatchRegExp, '');
    console.log(_field_value, value, value.replaceAll(placeholderReplaceRegExp, ''), _env);
    
    if (value.match(placeholderMatchRegExp)) {
        return [_env, ...value.replaceAll(placeholderReplaceRegExp, '').split('.')].reduce((a,b) => a[b]);
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