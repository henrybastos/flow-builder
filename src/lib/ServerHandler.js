export class ServerHandler {
    static logger;
    static logger_tags;
    static currentPresetName = '';
    static isRequestCanceled = false;
    static isFLowAPILoading = false;
    static responsePayload = JSON.stringify({ response: 'Nothing to display :D' });
    static closeBrowserPayload = {
        "config": {
            "ws_endpoint": false,
            "close_browser_on_finish": false,
            "close_browser_on_cancel_request": false
        },
        "env": {},
        "flows": {
            "main_flow": [{ "command": "close_browser" }]
        }
    }

    static parseSSEData (_raw_data) {
        let event_collection = _raw_data.split('\n\n').filter(v=>v);
        
        return event_collection.map(event_lines => {
            const [event, data] = event_lines.split('\n').filter(v=>v).map(line => {
                return ( line.slice(7).trim(), line.slice(6).trim() );
            });
            return { event, data: JSON.parse(data) };
        });
    }

    static async loopReader (_reader) {
        const {value, done} = await _reader.read();
        let SSEData = '';
        
        if (done) return;
    
        // To fix
        if (this.isRequestCanceled) {
            await _reader.cancel();
        }
    
        SSEData = this.parseSSEData(value);
    
        for (let sse_event of SSEData) {
            switch (sse_event.event) {
                case 'response':
                    this.responsePayload = JSON.stringify(sse_event.data.payload, null, 3);
                    // console.dir(this.responsePayload, { depth: null });
                    this.logger.logMessage(sse_event.data.message, this.logger_tags[sse_event.data.status_message]);
                    break;
                default:
                    this.logger.logMessage(sse_event.data.message, this.logger_tags[sse_event.data.status_message]);
                break;
            }
        }
    
        await this.loopReader(_reader);
    }
    
    static async closeBrowserOnCancelRequest () {
        await fetch('http://localhost:5173/api/run-flow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( this.closeBrowserPayload )
        });
        console.warn('Close!');
    }

    static async sendFlowPayload (_payload) {
        try {
            _payload = JSON.parse(_payload);
        } catch (err) {
            this.logger.logMessage('Invalid JSON as payload.', this.logger_tags.error);
        }
    
        if (Object.keys(_payload.flows.main_flow).length > 0) {
            this.isFLowAPILoading = true;
            this.isRequestCanceled = false;
            
            try {
                this.logger.logMessage(
                    `${ this.currentPresetName ? `[PRESET # ${ this.currentPresetName }] ` : '' } Calling API...`, 
                    this.logger_tags.info
                );

                const response = await fetch('http://localhost:5173/api/run-flow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( _payload )
                });
    
                this.logger.logMessage('Handling response stream...', this.logger_tags.info);
    
                const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
                await this.loopReader(reader);
    
                // WIP
                // if ($PAYLOAD.config.close_browser_on_cancel_request) {
                //     await closeBrowserOnCancelRequest();
                // }
    
                if (this.isRequestCanceled === true) {
                    this.logger.logMessage('Request canceled by the user.', this.logger_tags.warning);
                } else {
                    this.logger.logMessage('Finished', this.logger_tags.info);
                }
            } catch (err) {
                console.error(err);
                this.logger.logMessage('Fetch error. Something went wrong.', this.logger_tags.error);
            }
        } else {
            this.logger.logMessage('Main Flow cannot be empty. Nothing to run.', this.logger_tags.error);
        }
    
        this.isFLowAPILoading = false;
    }
}