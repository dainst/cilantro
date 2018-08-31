const http = require('http');
const {URL} = require('url');

const urlParts = ['scheme', 'username', 'password', 'hostname', 'path', 'query', 'fragment'];

module.exports = (theUrl, options, body) => new Promise((resolve, reject) => {
    const urlObj = new URL(theUrl);

    options.host = urlObj.hostname;
    options.port = urlObj.port;
    options.path = urlObj.pathname;
    options.protocol = urlObj.protocol;

    const req = http.request(options, res => {
        let result = '';
        console.info(`${req.method} ${req.path}`)
        res.setEncoding('utf8');
        res.on('data', chunk => result += chunk);
        res.on('end', () => resolve(result));
        res.on('error', reject);
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
});