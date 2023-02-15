const winston = require('winston');


/**
 * Returns a winston logger instance.
 * Available levels: error, warn, info, http, verbose, debug, silly
 */
module.exports = getLogger = (config) => {
    const formatCli = winston.format.cli();
    const formatJson = winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    );

    const logger = winston.createLogger({
        format: config.json ? formatJson : formatCli,
        transports: [
            new winston.transports.Console(),
        ],
    });
    logger.info('Logger started!');
    return logger;
};
