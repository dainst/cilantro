const zenonFakeData = require('../resources/zenon/fakedata.json');

module.exports = function fakeZenon(req, res, next) {
    const url = req.url.split("/");

    if (req.params.endpoint === "search") {
        return res.status(200).json(zenonFakeData.search[req.query.lookfor]);
    }

    if (req.params.endpoint === "record") {
        return res.status(req.query.id === "000000000" ? 404 : 200).json(zenonFakeData.record[req.query.id]);
    }

    next();

};