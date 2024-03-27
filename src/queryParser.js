function parseQuery(query) {
  const selectRegex = /SELECT\s+(.*?)\s+FROM\s+(.*?)(?:\s+WHERE\s+(.*?))?$/i;
  const matches = query.match(selectRegex);

  if (matches) {
    const fields = matches[1].split(',').map(field => field.trim());
    const table = matches[2].trim();
    const whereClause = matches[3] ? matches[3].trim() : null;

    // console.log({ fields, table, whereClause }); // Logging the parsed query for debugging

    return { fields, table, whereClause };
  } else {
    throw new Error('Invalid query format');
  }
}

const parsedQuery = parseQuery("SELECT id, name FROM sample");
console.log(parsedQuery);

module.exports = parseQuery;
