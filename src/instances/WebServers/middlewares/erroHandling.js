const { config, logger } = require('../../container.js')();

module.exports = errorHandler = (error, req, res, next) => {
    if (res.headersSent) {
        logger.error(`Route error (header already sent) ${req.originalUrl}:`, error);
    } else {
        if(error.constructor.name === 'MulterError'){
            logger.warn(`Multipart Parser Warning: ${req.originalUrl}:`, error);
            return res.sendApiError(error.code, 406);
        }else{
            logger.error(`Route error ${req.originalUrl}:`, error);
            if(config.env === 'development'){
                console.dir(error)
            }
            return res.sendApiError(error.message);
        }
    }
}
