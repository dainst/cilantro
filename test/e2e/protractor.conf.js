fs = require('fs');
process = require('process');

const prepareCilantro = require('./util/prepare_cilantro.js');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

const reporter = new HtmlScreenshotReporter({
    dest: 'test/e2e/screenshots',
    filename: 'my-report.html'
});

exports.config = {
    chromeDriver : '../../node_modules/chromedriver/lib/chromedriver/chromedriver' + (process.platform === 'win32' ? '.exe' : ''),
    baseUrl: "http://localhost:9082",
    suites: {
       util: './util/delays.js',
       tests: 'specs/**.spec.js'
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

    onPrepare: () => {
        prepareCilantro.run();
        jasmine.getEnv().addReporter(reporter)
    },

    afterLaunch: exitCode => new Promise(resolve => reporter.afterLaunch(resolve.bind(this, exitCode))),

    promisesDelay: 0

};
