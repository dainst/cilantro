module.exports = function missingFile(req, res, next) {
    res.status(404);
    next();
};