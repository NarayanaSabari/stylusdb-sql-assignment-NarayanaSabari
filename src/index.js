const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
    try {
        const { fields, table, whereClauses } = parseQuery(query);
        const csvData = await readCSV(`${table}.csv`);

        const filteredData = whereClauses
            ? csvData.filter(row => {
                let satisfiesCondition = true;
                for (const condition of whereClauses) {
                    const { field, operator, value } = condition;
                    if (operator === '=' && row[field] !== value) {
                        satisfiesCondition = false;
                        break;
                    }
                }
                return satisfiesCondition;
            })
            : csvData;

        const parsedData = filteredData.map(row => {
            const parsedRow = {};
            for (const field of fields) {
                parsedRow[field] = row[field];
            }
            return parsedRow;
        });

        return parsedData;
    } catch (error) {
        console.error('Error executing SELECT query:', error);
        throw error;
    }
}

module.exports = executeSELECTQuery;
