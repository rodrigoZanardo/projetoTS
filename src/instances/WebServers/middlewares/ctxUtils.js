const { logger } = require('../../container.js')();


/**
 * Sends a response with a standard format.
 * Usage: return res.sendApiError('err_code', 403, `blablabla`);
 * @param {*} req 
 * @param {*} res 
 * @param {String} message 
 * @param {Number} status 
 * @param {String} info 
 * @returns 
 */
const sendApiError = (req, res, message, status, info) => {
    const code = status ?? 500;
    return res.status(code).send({
        error: true,
        statusCode: code,
        message: (code < 500 && message) ? message : 'internal_error',
        info
    });
}


/**
 * Checks the user's request for a specific permission.
 * Usage: if(!req.hasPermission('users.read')) return;
 * @param {*} req 
 * @param {*} res 
 * @param {String} perm 
 * @returns 
 */
const hasPermission = (req, res, perm) => {
    const permString = JSON.stringify(perm);
    if (!req?.user?.perms) {
        res.sendApiError('missing_permission', 403, `Você Não Tem Permissão para.`);
        logger.warn(`[${req?.user?.email}] Permission ${permString} denied.`);
        return false;
    }

    if (Array.isArray(perm) && perm.some(p => req.user.perms.has(p))) {
        return true;
    } else if (req.user.perms.has(perm)) {
        return true;
    } else {
        res.sendApiError('missing_permission', 403, ` Você Não Tem Permissão para ${permString}`);
        logger.warn(`[${req?.user?.email}] Permission ${permString} denied.`);
        return false;
    }
}


module.exports = utils = (req, res, next) => {
    req.hasPermission = (...params) => hasPermission(req, res, ...params);
    res.sendApiError = (...params) => sendApiError(req, res, ...params);

    next();
}
