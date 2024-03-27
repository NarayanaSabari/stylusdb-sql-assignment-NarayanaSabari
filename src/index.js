const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    try {
        const { fields, table, whereClause } = parseQuery(query);
        const csvData = await readCSV(`${table}.csv`);

        const filteredData = whereClause
            ? csvData.filter(row => {
                const [field, value] = whereClause.split('=').map(s => s.trim());
                return row[field] === value;
            })
            : csvData;

        const parsedData = filteredData.map(row => 
            fields.reduce((parsedRow, field) => {
                parsedRow[field] = row[field];
                return parsedRow;
            }, {})
        );

        return parsedData;
    } catch (error) {
        console.error('Error executing SELECT query:', error);
        throw error;
    }
}

module.exports = executeSELECTQuery;
