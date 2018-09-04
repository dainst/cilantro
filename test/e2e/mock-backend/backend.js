const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');

const validateJsonParams = require('./validate_json_params');
const fakeZenon = require('./fake_zenon');
const fakeStaging = require('./fake_staging');

const server = jsonServer.create();
const router = jsonServer.router('routes.json');
const middleWares = jsonServer.defaults();
const port = 3333;

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(middleWares);
server.use('/job', validateJsonParams);
server.use('/zenon/:endpoint', fakeZenon);

server.use('/staging', fakeStaging);
server.use('/staging', express.static(path.join(__dirname, '/../resources/staging')));

server.use(router);
server.listen(port, () => {
    console.log('Mock backend is running on port ' + port)
});
