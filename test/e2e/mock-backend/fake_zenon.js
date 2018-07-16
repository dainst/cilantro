const zenonFakeData = require('../ressources/zenon/fakedata.json');

module.exports = function fakeZenon(req, res, next) {
    // const url = req.url.split("/");
    // // params, _parsedUrl: body,
    // console.log(req.query);
    res.status(200).json(zenonFakeData);
};