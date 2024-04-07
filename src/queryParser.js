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
    try {
        const selectRegex = /^SELECT\s(.*?)\sFROM\s(.*?)(?:\s(INNER|LEFT|RIGHT)\sJOIN\s(.*?)\sON\s(.*?))?(?:\sWHERE\s(.*?))?(?:\sGROUP\sBY\s(.*?))?(?:\sORDER\sBY\s(.*?))?(?:\sLIMIT\s(\d+))?$/i;

        const matches = query.match(selectRegex);

        if (!matches[1]) {
            throw new Error(`Invalid SELECT format.`);
        }



        const fields = matches[1].split(',').map(field => field.trim());
        const table = matches[2].trim();
        const { joinType, joinTable, joinCondition } = parseJoinClause(query);
        const whereClause = matches[6] ? matches[6].trim() : null;
        const whereClauses = whereClause ? parseWhereClause(whereClause) : [];
        const groupByFields = matches[7] ? matches[7].split(',').map(field => field.trim()) : null;
        const orderByFields = matches[8] ? matches[8].split(',').map(field => {
            const [fieldName, order] = field.trim().split(/\s+/);
            return { fieldName, order: order ? order.toUpperCase() : 'ASC' };
        }) : null;
        const hasAggregateWithoutGroupBy = hasAggregateWithoutGroupBy_(fields) && !groupByFields;
        const limit = matches[9] ? parseInt(matches[9]) : null;

        return { fields, table, whereClauses, groupByFields, orderByFields, joinType, joinTable, joinCondition, hasAggregateWithoutGroupBy, limit };
    } catch (error) {
        throw new Error(`Query parsing error: ${error.message}`);
    }
}



// const parsedQuery = parseQuery("SELECT id, name FROM student");
// console.log(parsedQuery);

// Exporting both parseQuery and parseJoinClause
module.exports = { parseQuery,parseJoinClause };