async function download_image ({ target, attr, filename }) {
    const link = await this.scrape_attr({ target, attr });
    const [element] = await this.getElement(target);

    this.logger.logEvent('operation_log', {
        message: `Trying to download  ${ link } ...`,
        status_message: 'info'
    });
    
    await element.evaluate(async (el, link, filename) => {
        const response = await fetch(link);
        const blobImage = await response.blob();
        const href = URL.createObjectURL(blobImage);

        const anchor = document.createElement('a');
        anchor.setAttribute('download', filename);
        anchor.setAttribute('href', href);

        document.querySelector('body').appendChild(anchor);
        anchor.click();
    }, link, filename);
}

export default download_image;