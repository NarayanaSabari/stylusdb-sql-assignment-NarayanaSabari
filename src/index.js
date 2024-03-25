const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    try {
        const data = parseQuery(query);
        const csvData = await readCSV(`${data.table}.csv`);
        const parsedData = csvData.map(row => {
            const parsedRow = {};
            data.fields.forEach(field => {
                parsedRow[field] = row[field];
            });
            return parsedRow;
        });
        return parsedData;
    } catch (error) {
        console.error('Error executing SELECT query:', error);
        throw error;
    }
}


module.exports = executeSELECTQuery;
