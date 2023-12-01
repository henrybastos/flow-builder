const envPlaceholder = {
    start: '%',
    end: '%'
}

export const placeholderMatchRegExp = new RegExp(`${ envPlaceholder.start }.*${ envPlaceholder.end }`, 'g');

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