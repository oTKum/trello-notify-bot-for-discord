const SimpleNodeLogger = require('simple-node-logger');

const opts = {
    logDirectory: '../../logs',
    logFilePath    : 'system.log',
    timestampFormat: 'YYYY-MM-DD HH:mm:ss'
};

const logger = SimpleNodeLogger.createSimpleLogger(opts);

module.exports = logger;
