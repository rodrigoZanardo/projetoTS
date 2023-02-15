const { logger, AuthProvider } = require('../container.js')();
const logsApisService = require('../../components/logsApis/logsApisService')

const extractBearerToken = (req) => {
    //Decoding request headers 
    const authHeader = req.get('Authorization');
    if (typeof authHeader !== 'string') {
        return { error: 'missing authorization header' }
    }
    const [authType, token] = authHeader.split(' ', 2);
    if (authType !== 'Bearer') {
        return { error: 'authorization type is not a bearer' }
    }
    if (!token.length) {
        return { error: 'token not found in authorization bearer header' }
    }

    return { token };
}

//CICD auth method
const cicdAuth = async (req, res, next) => {
    try {
        const { token, error } = extractBearerToken(req);
        if (error) {
            return res.sendApiError('not_authenticated', 401, error);
        }

        //Setting user var
        req.user = await AuthProvider.getCicdUserByToken(token);
    } catch (error) {
        if (error.safe) {
            logger.warn(`[${req.ip}] Auth failed: ${error.message}`)
            return res.sendApiError('forbidden', 401, error.message);
        } else {
            logger.error(`[${req.ip}] Auth error: ${error.message}`)
            return res.sendApiError('internal_authentication_error', 500);
        }
    }

    return next();
}

//User auth method
const userAuth = async (req, res, next) => {
    try {

        const { token, error } = extractBearerToken(req);

        if (error) {
            await logsApisService.insert('not_authenticated', req.user?.email || '', error, req.body)
            return res.sendApiError('not_authenticated', 401, error);
        }
        if (token.length < 20) {
            await logsApisService.insert('not_authenticated', req.user?.email || '', 'token too short', req.body)
            return res.sendApiError('not_authenticated', 401, 'token too short');
        }

        //Setting user var
        req.user = await AuthProvider.getUserByToken(token);
    } catch (error) {
        console.log('>>>>', error)
        await logsApisService.insert('internal_authentication_error', req.user?.email || '', error.message, req.body)

        if (error.safe) {
            logger.warn(`[${req.ip}] Auth failed: ${error.message}`)
            return res.sendApiError('forbidden', 401, error.message);
        } else {
            logger.error(`[${req.ip}] Auth error: ${error.message}`)
            return res.sendApiError('internal_authentication_error', 500);
        }
    }

    return next();
}

module.exports = requestAuth = (endpointType) => {
    if (endpointType === 'cicd') {
        return cicdAuth;
    } else if (endpointType === 'user') {
        return userAuth;
    } else {
        return (req, res, next) => {
            next(new Error('invalid authenticator type'));
        }
    }
};
