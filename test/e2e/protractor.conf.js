fs = require('fs');
process = require('process');

exports.config = {
    chromeDriver : '../../node_modules/chromedriver/lib/chromedriver/chromedriver' + (process.platform === 'win32' ? '.exe' : ''),
    baseUrl: require('./util/readSettings').get('importer_url'),
    suites: {
       util: './util/delays.js',
       tests: 'specs/*.spec.js'
    },
    directConnect: true,
    exclude: [],
    chromeOnly: true,
    multiCapabilities: [{
        browserName: 'chrome'
    }],
    allScriptsTimeout: 110000,
    getPageTimeout: 100000,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 400000
    },
    plugins: [
        {
            package: 'protractor-console-plugin',
            failOnWarning: false,
            failOnError: false,
            logWarnings: true,
            exclude: []
        }
    ],
    onPrepare: function() {}
};
