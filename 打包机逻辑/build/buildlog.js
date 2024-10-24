const fs = require('fs');
const logPath = 'buildlog.txt';
class buildLog {

    static async delLogFile() {
        if (fs.existsSync(logPath)) {
            fs.unlinkSync(logPath);
        }
    }

    static async writeLog(content) {
        fs.appendFileSync(logPath, content);
    }
}

module.exports = buildLog
