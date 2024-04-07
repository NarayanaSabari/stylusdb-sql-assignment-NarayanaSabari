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

async function writeCSV(filePath, data) {
    try {
        // Create the CSV header
        const header = Object.keys(data[0]).join(',');

        // Create CSV content
        const csvContent = data.map(row => Object.values(row).join(',')).join('\n');

        // Write CSV header and content to file
        await fs.promises.writeFile(filePath, `${header}\n${csvContent}`);

        console.log(`CSV file '${filePath}' has been successfully written.`);
    } catch (error) {
        throw new Error(`Error writing CSV file: ${error.message}`);
    }
}

module.exports = {readCSV,writeCSV};
