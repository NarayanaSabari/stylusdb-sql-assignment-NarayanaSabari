function hasAggregateWithoutGroupBy_(fields) {
    const aggregateRegex = /(\bCOUNT\b|\bAVG\b|\bSUM\b|\bMIN\b|\bMAX\b)\s*\(\s*(\*|\w+)\s*\)/i
    return fields.some(field => aggregateRegex.test(field));
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

function parseJoinClause(query) {
    const joinRegex = /\s(INNER|LEFT|RIGHT) JOIN\s(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
    const joinMatch = query.match(joinRegex);

    if (joinMatch) {
        return {
            joinType: joinMatch[1].trim(),
            joinTable: joinMatch[2].trim(),
            joinCondition: {
                left: joinMatch[3].trim(),
                right: joinMatch[4].trim()
            }
        };
    }

    return {
        joinType: null,
        joinTable: null,
        joinCondition: null
    };
}

function parseQuery(query) {
    const selectRegex = /^SELECT\s(.*?)\sFROM\s(.*?)(?:\s(INNER|LEFT|RIGHT)\sJOIN\s(.*?)\sON\s(.*?))?(?:\sWHERE\s(.*?))?(?:\sGROUP\sBY\s(.*?))?$/i;
    const matches = query.match(selectRegex);

    if (matches) {
        const fields = matches[1].split(',').map(field => field.trim());
        const table = matches[2].trim();
        const {joinType,joinTable,joinCondition} = parseJoinClause(query)
        const whereClause = matches[6] ? matches[6].trim() : null;
        const whereClauses = whereClause ? parseWhereClause(whereClause) : [];
        const groupByFields = matches[7] ? matches[7].split(',').map(field => field.trim()) : null;
        const hasAggregateWithoutGroupBy = hasAggregateWithoutGroupBy_(fields) && !groupByFields  ;
        return { fields, table, whereClauses, groupByFields, joinType, joinTable, joinCondition, hasAggregateWithoutGroupBy };
    } else {
        throw new Error('Invalid query format');
    }
}

const parsedQuery = parseQuery("SELECT * FROM table1 INNER JOIN table2 ON table1.id = table2.ref_id");
console.log(parsedQuery);

// Exporting both parseQuery and parseJoinClause
module.exports = { parseQuery,parseJoinClause };