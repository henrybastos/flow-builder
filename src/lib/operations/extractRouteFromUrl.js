async function extract_route_from_url ({ regex }) {
    this.logger.logEvent('operation_log', {
        message: `Retrieving route  ${ regex }...`,
        status_message: 'info'
    });

    // const pathnameRegex = new RegExp('(?<=/cursos/[0-9]*/editar/modulos/).*(?=/aula/)', 'g')
    const pathnameRegex = new RegExp(regex, 'g');
    const urlPathname = await this.curr_page.evaluate(() => window.location.pathname)
    const [urlRoute] = urlPathname.match(pathnameRegex);

    this.logger.logEvent('operation_log', {
        message: `Route retrieved: ${ urlRoute }...`,
        status_message: 'info'
    });

    return urlRoute;
}

export default extract_route_from_url;