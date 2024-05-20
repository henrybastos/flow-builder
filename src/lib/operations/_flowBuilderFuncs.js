// Some functions are then treated in the /api/run-flow/+server.js at the switch case inside evalOperation method.

// export const expose = (value) => {
//     return { _expose_key: '_$fb', ...value };
// };

/** Sets a value in env payload. */
export const env = (obj) => obj;

/** Sets a value in env payload with a query. */
export const env_query = (obj) => {
    const [queryKey, value] = Object.entries(obj)?.[0];
    console.log({ [`@query:${queryKey}`]: value });
    return { [`@query:${queryKey}`]: value };
};

export const x = (path, root) => document.evaluate(path, root || document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

export const xxx = (path, root) => {
    const nodesSnapshot = document.evaluate(path, root || document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let elements = [];
    for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
        elements.push(nodesSnapshot.snapshotItem(i));
    }
    return elements;
}

/**
 * Sets an element attribute/property and bubbles up the events "input" and "change";
 * @param {string} x_path - The XPath to locate the element.
 * @param {string} value - The value to be set.
 * @param {string} attribute - The attribute/property to change the value of.
 */
export const set_element_value = (x_path, value, attribute = 'value') => {
    const element = x(x_path);
    try {
        element.focus();
        element[attribute] = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    } catch (err) {
        console.log('Failed to set element value');
        return ({ error: 'Failed to set element value' });
    }
}

export const goto = (href) => { window.location.href = href };

export const async_eval = async (maxAttempts = 5, interval = 5000, cb, elsePayload) => {
    let attempt = 0;
    let evalReturnValue = 'No response from async_eval Promise.';

    if (cb) {
        evalReturnValue = await new Promise((resolve) => {
            const timeInterval = setInterval(() => {
                attempt++;
                console.log(`Attempt ${attempt} of ${maxAttempts}`);

                const cbResolve = (value) => {
                    clearInterval(timeInterval);
                    resolve(value);
                }

                try {
                    const cbError = cb(cbResolve);

                    if (attempt >= maxAttempts) {
                        clearInterval(timeInterval);
                        if (cbError) { 
                            resolve(cbError); 
                        } else {
                            resolve(elsePayload || { '@private:warning': `Max attempts reached: ${maxAttempts}` });
                        }
                    }
                } catch (err) {
                    resolve({ error: err });
                    clearInterval(timeInterval);
                }
            }, interval)
        });
    } else {
        evalReturnValue = 'No callback function found to execute on the async_eval function.'
    }

    console.log('[ASYNC EVAL RESULT]', evalReturnValue);
    return evalReturnValue;
}

export const wait_for_element = async (secs, xpath) => {
    return async_eval((secs * 5), 200, (res) => { const el = x(xpath); el && res(true); })
}

export const download_blob = async (filename, link) => {
    // Hoping it resolves CORS problems

    let startTime = Date.now();

    console.log(`[${new Date().toLocaleTimeString()}] Fetching url...`);
    const response = await fetch(link);
    console.log(`[${new Date().toLocaleTimeString()}] Converting to blob...`);
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);

    const anchor = document.createElement('a');
    anchor.setAttribute('download', filename);
    anchor.setAttribute('href', href);

    document.querySelector('body').appendChild(anchor);
    console.log(`[${new Date().toLocaleTimeString()}] Downloading...`);
    anchor.click();

    let elapsedTime = Math.ceil(Date.now() - startTime);
    let formattedElapsedTime = `${Math.floor((elapsedTime / 1000) / 60)}m ${Math.floor((elapsedTime / 1000) % 60)}s ${Math.floor(elapsedTime % 1000)}ms`

    console.log(`[${new Date().toLocaleTimeString()}] Done`);
    console.log(`Elapsed time: ${formattedElapsedTime}`);
}

// export const download_yt_video = async (filename) => {
//     const ytPayload = JSON.parse(x("//*/script[contains(text(), 'var ytInitialPlayerResponse')]").innerText
//             .replace('var ytInitialPlayerResponse = ', '')
//             .replace(/(;$|;var (meta|head).*)/, ''))

//     console.log();

//     const [hd] = ytPayload.streamingData.formats.filter(({ qualityLabel }) => qualityLabel == '720p').map(({ url, quality, audioQuality, fps }) => {
//         return {
//             fps,
//             audioQuality,
//             quality,
//             url: decodeURIComponent(url)
//         }
//     });
//     console.log(hd);
//     goto(hd.url);
//     await download_blob(filename, fhd.url);
//     return fhd.url;
// }