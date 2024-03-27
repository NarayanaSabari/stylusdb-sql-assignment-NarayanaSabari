function parseQuery(query) {
  const selectRegex = /SELECT\s+(.*?)\s+FROM\s+(.*?)(?:\s+WHERE\s+(.*?))?$/i;
  const matches = query.match(selectRegex);

  if (matches) {
    const fields = matches[1].split(',').map(field => field.trim());
    const table = matches[2].trim();
    const whereClauses = matches[3] ? matches[3].split(/ AND | OR /i).map(condition => {
        const [field, operator, value] = condition.trim().split(/\s+/);
        return { field, operator, value };
    }) : [];

    // console.log({ fields, table, whereClause }); // Logging the parsed query for debugging

    return { fields, table, whereClauses };
  } else {
    throw new Error('Invalid query format');
  }
}

// const parsedQuery = parseQuery("SELECT id, name FROM sample WHERE age = 30");
// console.log(parsedQuery);

module.exports = parseQuery;
