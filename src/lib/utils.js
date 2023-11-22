const envPlaceholder = {
    start: '%',
    end: '%'
}

const placeholderMatchRegExp = new RegExp(`${ envPlaceholder.start }.*${ envPlaceholder.end }`, 'g');
const placeholderReplaceRegExp = new RegExp(`(${ envPlaceholder.start }|${ envPlaceholder.end })`, 'g');

export function convertInputsToKronusJson (_structure_type, _obj, _structure) {
    let buffer = [];

    switch (_structure_type) {
        case 'course_copy':
            for (let key of Object.keys(_obj)) {
                switch (key) {
                    case 'how_items':
                        buffer.push(...courseConversionTransforms.how_items( _structure[key], _obj[key].items ));
                        break;
                    case 'bonus':
                        buffer.push(...courseConversionTransforms.bonus( _structure[key], _obj[key].items ));
                        break;
                    case 'options':
                        buffer.push(...courseConversionTransforms.options( _structure[key], _obj[key].items ));
                        break;
                    case 'faq':
                        buffer.push(...courseConversionTransforms.faq( _structure[key], _obj[key].items ).flat());
                        break;
                    default:
                        buffer.push({
                            "key": _structure[key],
                            "value": `\n${ _obj[key].value.trim() }\n`
                        });
                        break;
                }
            }
            
            buffer.push(
                {
                    "key": "301",
                    "value": "\nSobre o Curso\n"
                }
            );
            break;
        case 'expert_copy':
            for (let key of Object.keys(_obj)) {
                console.log(`Key: ${ key }`);
                
                switch (key) {
                    case 'specialty':
                        buffer.push(expertConversionTransforms.specialty( _structure[key], _obj[key].value.trim() ));
                        break;
                    case 'full_description':
                        buffer.push(expertConversionTransforms.full_description( _structure[key], _obj[key].value.trim() ));
                        break;
                    case 'link_selling':
                        buffer.push(expertConversionTransforms.link_selling( _structure[key], _obj[key].value.trim() ));
                        break;
                    default:
                        buffer.push({
                            "key": _structure[key],
                            "value": `\n${ _obj[key].value.trim() }\n`
                        });
                        break;
                }
            }
            break;
    }

    return buffer;
}

const expertConversionTransforms = {
    full_description: (_key, _value) => {
        return {
            "key": _key,
            "value": `\nDescrição Completa:\n${ _value.trim() }\n`
        }
    },
    specialty: (_key, _value) => {
        return {
            "key": _key,
            "value": `\nEspecialidade:\n${ _value.trim() }\n`
        }
    },
    link_selling: (_key, _value) => {
        return {
            "key": _key,
            "value": `\nUrl do Site:\n${ _value.trim() }\n`
        }
    }
}

const courseConversionTransforms = {
    how_items: (_keys, _items) => {
        let howItems = _items.map((_item, _i) => {
            return {
                key: _keys[_i],
                value: `\n${ _item.title.value.trim() }\n${ _item.description.value.trim() }\n`
            }
        })
        return howItems;
    },
    bonus: (_keys, _items) => {
        let bonusItems = _items.map((_item, _i) => {
            return {
                key: _keys[_i],
                value: `\nBônus ${ _i + 1 }\nTítulo:\n${ _item.title.value.trim() }\nDescrição:\n${ _item.description.value.trim() }\nPreço:\n${ _item.price.value.trim() }\nHeadlines:\n${ _item.headline_1.value.trim() }\n${ _item.headline_2.value.trim() }\n${ _item.headline_3.value.trim() }\n`
            }
        })
        return bonusItems;
    },
    options: (_keys, _items) => {
        let optionsItems = _items.map((_item, _i) => {
            return {
                key: _keys[_i],
                value: `\n${ _item.option.value.trim() }\n`
            }
        })
        return optionsItems;
    },
    faq: (_keys, _items) => {
        let faqIndex = 0;
        
        let faqItems = _items.map((_item) => {
            const question = {
                key: _keys[faqIndex],
                value: `\n${ _item.title.value.trim() }\n`
            };

            const answer = {
                key: _keys[faqIndex + 1],
                value: `\n${ _item.answer.value.trim() }\n`
            };

            faqIndex += 2;
            
            return [ question, answer ];
        });

        return faqItems;
    }
};

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

export function trimEnvPlaceholder (_str) {
    return _str.match(placeholderMatchRegExp)[0].replaceAll(placeholderReplaceRegExp, '');
}

export function replaceEnvPlaceholder (_str, _env) {
    const envVariable = _env[trimEnvPlaceholder(_str)];
    return _str.replaceAll(/%.*%/g, envVariable);
}

export function genUUID () {
    return Math.random().toString().slice(2);
}

/**
 * Checks if click was on any of the elements with the guides
 * @param {*} _guides 
 * @param {*} _target 
 * @returns 
 */
export function checkClickOnGuideIDs (_guides, _target) {
    return _guides.includes(_target.dataset.guideId);
}