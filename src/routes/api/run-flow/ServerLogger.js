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
        const message = `event: ${ _response_event }\ndata: ${ JSON.stringify(_response_payload) }\n\n`;
        console.log(message);
        this.controller.enqueue(message);
    }

    static closeStream () {
        this.controller.close();       
    }
}