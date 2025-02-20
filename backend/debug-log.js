const fs = require('fs').promises;
const path = require('path');

const logPath = path.join(__dirname, 'debug.log');

async function debugLog(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp}: ${message}\n`;
    try {
        await fs.appendFile(logPath, logMessage);
    } catch (error) {
        console.error('Logging failed:', error);
    }
}

module.exports = debugLog;