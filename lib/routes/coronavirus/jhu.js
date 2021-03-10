const got = require('@/utils/got');
const parse = require('csv-parse/lib/sync');

module.exports = async (ctx) => {
    const date = '01-01-2021'; // TODO: get from route
    // const date = ctx.params.date || '';

    let dailyReportURL = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/';
    dailyReportURL = `${dailyReportURL}${date}.csv`;

    // Read coronavirus live data from jhu github
    // Example: https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/01-01-2021.csv
    const csvResponse = await got({
        method: 'get',
        url: dailyReportURL,
    });

    const csvData = csvResponse.data;

    // Format data using js csv parser
    const data = parse(csvData, {
        columns: true,
        skip_empty_lines: true,
    });

    // TODO: async (avoid http request timeout)
    // 1. Parse column names from the first row
    let colNames = '<tr>'; // TODO: check length of data
    for (const colName in data[0]) {
        colNames += `<th>${colName}</th>`;
    }
    colNames += '</tr>';

    // 2. Parse each data row
    let items = '';
    for (const row of data) {
        items += '<tr>';
        for (const colName in data[0]) {
            items += `<td>${row[colName]}</td>`;
        }
        items += '</tr>';
    }
    const dataTable = `<table>${colNames}${items}</table>`;

    ctx.state.data = {
        title: '约翰斯霍普金斯大学实时COVID-19数据',
        link: 'https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6',
        description: '约翰斯霍普金斯大学实时COVID-19数据，提供了当前最新的各国COVID-19数据',
        item: [
            {
                title: 'test1',
                description: dataTable,
                link: 'https://gisanddata.maps.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6',
                pubDate: new Date(Date.now()).toUTCString(),
            },
        ],
    };
};
