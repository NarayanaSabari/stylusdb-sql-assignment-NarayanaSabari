function parseQuery(query) {
    const regex = /SELECT\s+(.*?)\s+FROM\s+(.*)/;
    const matches = query.match(regex);
    console.log(matches)
    if (matches && matches.length === 3) {
        const fields = matches[1].split(',').map(field => field.trim());
        const table = matches[2].trim();
        return { fields, table };
    } else {
        throw new Error('Invalid SQL query format');
    }
}

module.exports = parseQuery;
