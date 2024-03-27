const parseQuery = require('./queryParser');
const readCSV = require('./csvReader');

async function executeSELECTQuery(query) {
  try {
    const { fields, table, whereClauses } = parseQuery(query);
    const csvData = await readCSV(`${table}.csv`);

    const filteredData = whereClauses
      ? csvData.filter(row => {
          return whereClauses.every(condition => {
            const { field, operator, value } = condition;
            switch (operator) {
              case '=':
                return row[field] === value;
              case '>':
                return row[field] > value;
              case '<':
                return row[field] < value;
              case '>=':
                return row[field] >= value;
              case '<=':
                return row[field] <= value;
              case '!=':
                return row[field] !== value;
              default:
                throw new Error(`Unsupported operator: ${operator}`);
            }
          });
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

(async () => {
  try {
    const data = await executeSELECTQuery("SELECT id, name FROM sample WHERE age = 25");
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
})();

module.exports = executeSELECTQuery;