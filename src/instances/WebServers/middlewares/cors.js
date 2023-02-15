const cors = require('cors');
const { logger, config } = require('../../container.js')();

//TODO: testar com https e nginx rodando
const originValidator = (req, res, next) => {
    if(req.headers.origin && !req.headers.origin.startsWith(`https://${config.webServer.domain}`)){
        logger.warn(`CORS violation with origin: ${req.headers.origin} from ${req.ip}`);
        return res.sendApiError('cors_violation', 400);
    }else{
        next();
    }
}

module.exports = (config.webServer.checkCORS)
    ? [
        originValidator, 
        cors({origin: `https://${config.webServer.domain}`})
    ]
    : cors();
