const express = require('express');
const path = require('path');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const fakeRest = require('./fake-rest');
const server = jsonServer.create();
const router = jsonServer.router('routes.json');
const middleWares = jsonServer.defaults();
const port = 3000;

server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(middleWares);
server.use(fakeRest);

server.use('/test', express.static(path.join(__dirname, '/../ressources')));

server.use(router);
server.listen(port, () => {
    console.log('Mock backend is running on port ' + port)
});
