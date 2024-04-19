/**
 * @method logEvent
 */
export default class ServerLogger {
    static _setController (_controller) {
        this.controller = _controller;
    }

    /**
     * Logs an event from the server to the client.
     * @static
     * @function
     * @param {'operation_log'|'system'|'response'|'error'} _response_event A label to the event, for identification.
     * @param {string|{ message: string, status_message: 'info'|'success'|'error' }} _response_payload The JSON to be passed as response.
     */
    static logEvent (_response_event, _response_payload) {
        if (_response_event === 'response') {
            let responseDataString = JSON.stringify(_response_payload);
            
            const message = `event: response\ndata: ${ responseDataString }\n\n`;
            this.controller.enqueue(message);
        } else {
            const message = `event: ${ _response_event }\ndata: ${ JSON.stringify(_response_payload) }\n\n`;
            this.controller.enqueue(message);
        }
    }

    static closeStream () {
        try {
            this.controller.close();       
        } catch (err) {
            throw new Error('Controller closed by user.')
        }
    }
}