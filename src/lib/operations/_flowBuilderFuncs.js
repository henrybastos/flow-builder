export const x = (path) => document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

export const xxx = (path) => {
    const nodesSnapshot = document.evaluate(path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    let elements = [];
    for (let i = 0; i < nodesSnapshot.snapshotLength; i++) {
        elements.push(nodesSnapshot.snapshotItem(i));
    }
    return elements;
}

export const goto = (href) => { window.location.href = href };

export const download_blob = async (filename, link) => {
    // Hoping it resolves CORS problems
    
    let startTime = Date.now();

    console.log(`[${ new Date().toLocaleTimeString() }] Fetching url...`);
    const response = await fetch(link);
    console.log(`[${ new Date().toLocaleTimeString() }] Converting to blob...`);
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);
    
    const anchor = document.createElement('a');
    anchor.setAttribute('download', filename);
    anchor.setAttribute('href', href);
    
    document.querySelector('body').appendChild(anchor);
    console.log(`[${ new Date().toLocaleTimeString() }] Downloading...`);
    anchor.click();

    let elapsedTime = Math.ceil(Date.now() - startTime);
    let formattedElapsedTime = `${ Math.floor((elapsedTime / 1000) / 60) }m ${ Math.floor((elapsedTime / 1000) % 60) }s ${ Math.floor(elapsedTime % 1000) }ms`

    console.log(`[${ new Date().toLocaleTimeString() }] Done`);
    console.log(`Elapsed time: ${ formattedElapsedTime }`);
}

export const download_yt_video = async (filename) => {
    const ytPayload = JSON.parse(x("//*/script[contains(text(), 'var ytInitialPlayerResponse')]").innerText
            .replace('var ytInitialPlayerResponse = ', '')
            .replace(/(;$|;var (meta|head).*)/, ''))

    console.log();

    const [hd] = ytPayload.streamingData.formats.filter(({ qualityLabel }) => qualityLabel == '720p').map(({ url, quality, audioQuality, fps }) => {
        return {
            fps,
            audioQuality,
            quality,
            url: decodeURIComponent(url)
        }
    });
    // console.log(hd);
    goto(hd.url);
    // await download_blob(filename, fhd.url);
    // return fhd.url;
}