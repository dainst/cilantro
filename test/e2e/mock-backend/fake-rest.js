/**
 * because the php-backend is not rest-compatible, we use this middleware to fake it till we make it
 */
module.exports = function fakeRest(req, res, next) {
    if (req.method === 'POST') {
        req.method = 'GET';
        req.query = req.body;
        req.url = '/' + req.body.task;
    }

    next()
};