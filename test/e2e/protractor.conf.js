fs = require('fs');
process = require('process');

const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

const reporter = new HtmlScreenshotReporter({
    dest: 'test/e2e/screenshots',
    filename: 'my-report.html'
});

exports.config = {
    chromeDriver : '../../node_modules/chromedriver/lib/chromedriver/chromedriver' + (process.platform === 'win32' ? '.exe' : ''),
    baseUrl: require('./util/readSettings').get('importer_url'),
    suites: {
       util: './util/delays.js',
       tests: 'specs/documents.spec.js'
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
            logWarnings: false,
            exclude: []
        }
    ],

    beforeLaunch: () => new Promise(resolve => reporter.beforeLaunch(resolve)),

    onPrepare: () => jasmine.getEnv().addReporter(reporter),

    afterLaunch: exitCode => new Promise(resolve => reporter.afterLaunch(resolve.bind(this, exitCode)))

};
