function parseQuery(query) {
  // Log the input query to ensure it's correct
  // console.log(query);

  const selectRegex = /^SELECT\s(.*?)\sFROM\s(.*?)(?:\s(?:INNER\sJOIN\s(.*?)\sON\s(.*?))?)?\s?(WHERE\s(.*?))?$/i;

  // Check if the regular expression matches the query and log the matches
  const matches = query.match(selectRegex);
  // console.log(matches);

  if (matches) {
    const fields = matches[1].split(',').map(field => field.trim());
    const table = matches[2].trim();
    const joinTable = matches[3] ? matches[3].trim() : null;
    const joinCondition = matches[4] ? parseJoinCondition(matches[4].trim()) : null;
    const whereClause = matches[6] ? matches[6].trim() : null;
    const whereClauses = whereClause ? parseWhereClause(whereClause) : [];

    return { fields, table, whereClauses, joinTable, joinCondition };
  } else {
    throw new Error('Invalid query format');
  }
}

function parseJoinCondition(joinCondition) {
  const [left, right] = joinCondition.split('=').map(part => part.trim());
  return { left, right };
}

function parseWhereClause(whereClause) {
  const conditions = whereClause.split(' AND ').map(condition => {
    const [field, operator, value] = condition.trim().split(/\s+/);
    return { field, operator, value };
  });
  return conditions;
}

// const parsedQuery = parseQuery("SELECT id, name FROM student WHERE age = 30 AND name = John");
// console.log(parsedQuery);

module.exports = parseQuery;

