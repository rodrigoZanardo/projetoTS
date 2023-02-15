module.exports = notFound = (req, res, next) => {
    if(!req.route && !res.headersSent) return res.sendApiError('not_found', 404, 'try looking elsewhere');
    next();
}
