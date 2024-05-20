export class ServerHandler {
    static logger;
    static logger_tags;
    static currentPresetName = '';
    static isRequestCanceled = false;
    static isFLowAPILoading = false;
    static responsePayload = JSON.stringify({ response: 'Nothing to display :D' });
    static closeBrowserPayload = {
        config: {
            ws_endpoint: false,
            close_browser_on_finish: false,
            close_browser_on_cancel_request: false,
            headless: true
        },
        env: {},
        flows: {
            main_flow: [
                {
                    command: 'close_browser',
                    enabled: true
                }
            ]
        }
    }

    static parseSSEData (_raw_data) {
        let event_collection = _raw_data.split('\n\n').filter(v=>v);
        
        return event_collection.map(event_lines => {
            const [event, data] = event_lines.split('\n').filter(v=>v).map(line => {
                return ( line.slice(7).trim(), line.slice(6).trim() );
            });

            try {
                return { event, data: JSON.parse(data) };
            } catch (err) {
                console.log('Unable to parse data', data);
                return { event, data: { message: data || 'unparsed_message', status_message: 'info' } };
            }
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
                    this.responsePayload = JSON.stringify(sse_event.data?.payload || { error: 'Undefined payload. Check payload size (may be too big for text/stream).' }, null, 3);
                    // this.logger.logMessage(sse_event.data.message, this.logger_tags.info);
                    break;
                case 'system':
                    this.closeBrowserPayload.config.ws_endpoint = sse_event.data.message.match(/(?<=WS Endpoint:\s?).*/gi)[0].trim();
                    console.log('Close browser endpoint found and set', this.closeBrowserPayload.config);
                    this.logger.logMessage(sse_event.data.message, this.logger_tags[sse_event.data.status_message || 'info']);
                    break;
                default:
                    this.logger.logMessage(sse_event.data.message, this.logger_tags[sse_event.data.status_message || 'info']);
                    break;
            }
        }
    
        await this.loopReader(_reader);
    }
    
    static async closeBrowser () {
        this.isRequestCanceled = true;
        await fetch('/api/run-flow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( this.closeBrowserPayload )
        });
        console.warn('Closing browser...');
    }

    static async sendFlowPayload (_payload) {
        try {
            if (typeof _payload === 'string') { _payload = JSON.parse(_payload); }
        } catch (err) {
            this.logger.logMessage('Invalid JSON as payload.', this.logger_tags.error);
        }
    
        if (Object.keys(_payload.flows.main_flow).length > 0) {
            this.isFLowAPILoading = true;
            this.isRequestCanceled = false;
            
            let startTime = Date.now();

            try {
                this.logger.logMessage(
                    `${ this.currentPresetName ? `[PRESET # ${ this.currentPresetName }] ` : '' } Calling API...`, 
                    this.logger_tags.running
                );

                const response = await fetch('/api/run-flow', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify( _payload )
                });
    
                this.logger.logMessage('Handling response stream...', this.logger_tags.info);
    
                const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
                await this.loopReader(reader);
            } catch (err) {
                console.error(err);
                this.logger.logMessage('Fetch error. Something went wrong.', this.logger_tags.error);
            }

            if (this.isRequestCanceled === true) {
                this.logger.logMessage('Request canceled by the user.', this.logger_tags.warning);
            } else {
                this.logger.logMessage('Finished', this.logger_tags.info);
            }
            let elapsedTime = Math.ceil(Date.now() - startTime);
            let formattedElapsedTime = `${ Math.floor((elapsedTime / 1000) / 60) }m ${ Math.floor((elapsedTime / 1000) % 60) }s ${ Math.floor(elapsedTime % 1000) }ms`
            this.logger.logMessage(`${ formattedElapsedTime }`, this.logger_tags.timer);
        } else {
            this.logger.logMessage('Main Flow cannot be empty. Nothing to run.', this.logger_tags.error);
        }
    
        this.isRequestCanceled === false;
        this.isFLowAPILoading = false;
    }
}