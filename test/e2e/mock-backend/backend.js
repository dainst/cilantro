const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const validateJsonParams = require('./validate-json-params');
const missingFile = require('./missing_file');
const server = jsonServer.create();
const router = jsonServer.router('routes.json');
const middleWares = jsonServer.defaults();
const port = 3333;

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(middleWares);
server.use('/job', validateJsonParams);

server.use('/files', express.static(path.join(__dirname, '/../ressources')));
server.use('/files/broken_file.csv', missingFile);

server.use(router);
server.listen(port, () => {
    console.log('Mock backend is running on port ' + port)
});
