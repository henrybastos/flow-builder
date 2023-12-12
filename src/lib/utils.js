const envPlaceholder = {
    start: '%',
    end: '%'
}

/**
     * Transforms/filters the raw payload to a "readable" one.
     * @param _payload The object to transform.
     */
export function transformToJSON (_payload) {
    let payloadBuffer = structuredClone(_payload);
    Object.entries(payloadBuffer.flows).forEach(([flow_name, flow_body]) => {
        let flowBuffer = [];

        for (let operation of Object.values(flow_body)) {
            let operationBody = {
                command: operation.command,
                enabled: operation.enabled
            };
            
            if (operation?.input_fields) {
                Object.entries(operation.input_fields).forEach(([field_name, field]) => {
                    operationBody[field_name] = field.value;
                })
            }

            flowBuffer.push(operationBody);
        }

        payloadBuffer.flows[flow_name] = flowBuffer;
    });
    return JSON.stringify(payloadBuffer, null, 3);
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

export function copyToClipboard (_text) {
    window.navigator.clipboard.writeText(_text);
}