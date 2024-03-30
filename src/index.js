const parseQuery = require("./queryParser");
const readCSV = require("./csvReader");

async function executeSELECTQuery(query) {
  try {
    const { fields, table, whereClauses, joinTable, joinCondition } = parseQuery(query);

    let data = await readCSV(`${table}.csv`);

    // Perform INNER JOIN if specified
    if (joinTable && joinCondition) {
      const joinData = await readCSV(`${joinTable}.csv`);
      data = data.flatMap(mainRow => {
        return joinData
          .filter(joinRow => {
            const mainValue = mainRow[joinCondition.left.split('.')[1]];
            const joinValue = joinRow[joinCondition.right.split('.')[1]];
            return mainValue === joinValue;
          })
          .map(joinRow => {
            return fields.reduce((acc, field) => {
              const [tableName, fieldName] = field.split('.');
              acc[field] = tableName === table ? mainRow[fieldName] : joinRow[fieldName];
              return acc;
            }, {});
          });
      });
    }

    // Apply WHERE clause filtering after JOIN (or on the original data if no join)
    const filteredData = whereClauses.length > 0
      ? data.filter(row => whereClauses.every(clause => evaluateCondition(row, clause)))
      : data;

    // Handle field selection
    const parsedData = filteredData.map(row => {
      const selectedRow = {};
      fields.forEach(field => {
        selectedRow[field] = row[field];
      });
      return selectedRow;
    });

    return parsedData;
  } catch (error) {
    console.error("Error executing SELECT query:", error);
    throw error;
  }
}

function evaluateCondition(row, clause) {
  const { field, operator, value } = clause;
  const cleanedValue = value.replace(/'/g, ""); // Remove single quotes

  const fieldValue = row[field];
  switch (operator) {
    case "=":
      return fieldValue === cleanedValue;
    case ">":
      return fieldValue > cleanedValue;
    case "<":
      return fieldValue < cleanedValue;
    case ">=":
      return fieldValue >= cleanedValue;
    case "<=":
      return fieldValue <= cleanedValue;
    case "!=":
      return fieldValue !== cleanedValue;
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

(async () => {
  try {
    const data = await executeSELECTQuery(
      "SELECT id, name FROM student"
    );
    console.log("Result:", data);
  } catch (error) {
    console.error("Error:", error);
  }
})();

module.exports = executeSELECTQuery;