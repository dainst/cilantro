const express = require('express');
const path = require('path');


module.exports = function fakeStaging(req, res, next) {
    const url = req.url.split("/");

    if (url[1] === 'broken_file.csv') {
        res.status(404);
        next();
        return;
    }

    if (req.method === "POST") {
        const json = {};
        res.status("200").json({"e2e-testing.pdf": {success: true}});
        return;
    }

    next();

};