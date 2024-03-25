const csv = require('csv-parser');
const fs = require('fs');

async function readCSV(filePath) {
    const results = [];
    
    try {
        const stream = fs.createReadStream(filePath)
            .on('error', error => { throw error; });

        await new Promise((resolve, reject) => {
            stream.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', () => resolve())
                .on('error', (error) => reject(error));
        });
        
        return results;
    } catch (error) {
        throw error;
    }
}

module.exports = readCSV;
