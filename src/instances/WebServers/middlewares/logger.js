const expressWinston = require('express-winston');
const { logger } = require('../../container.js')();

const loggerOptions = {
    winstonInstance: logger,
    headerBlacklist: ['cookie', 'authorization'],
    level: 'http',
    msg: '[{{res.statusCode}}] {{req.method}} {{req.url}} {{res.responseTime}}ms',
    colorize: true,
    dynamicMeta: (req, res) => {
        const meta = {}
        if (req) {
            meta.remoteIP = req.ip;
        }
        return meta
    }
}

module.exports = expressWinston.logger(loggerOptions);
