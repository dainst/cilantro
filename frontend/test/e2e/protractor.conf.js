fs = require('fs');
process = require('process');

const prepareCilantro = require('./util/prepare_cilantro.js');
const HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

const frontendUrl = "http://localhost:7777";

const reporter = new HtmlScreenshotReporter({
    dest: 'test/e2e/screenshots',
    filename: 'my-report.html'
});

exports.config = {
    chromeDriver : '../../node_modules/chromedriver/lib/chromedriver/chromedriver' + (process.platform === 'win32' ? '.exe' : ''),
    baseUrl: frontendUrl,
    suites: {
       util: './util/delays.js',
       tests: 'specs/**.spec.js'
    },
    directConnect: true,
    exclude: [],
    chromeOnly: true,
    multiCapabilities: [{
        browserName: 'chrome',
        chromeOptions: {
            args: [
                "--no-sandbox",
                "--disable-gpu",
                '--window-size=1920,1024'
            ]
        }
    }],
    allScriptsTimeout: 110000,
    getPageTimeout: 100000,
    framework: 'jasmine2',
    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 600000
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
        logFix = {
            specDone: function(result) {
                if(result.status.toString() != 'disabled'){
                    console.log('\n'+result.fullName + ' : '+ result.status);
                }
            }
        };
        jasmine.getEnv().addReporter(logFix);

        const defer = protractor.promise.defer();
        jasmine.getEnv().addReporter(reporter);
        prepareCilantro.prepare(frontendUrl)
            .then(defer.fulfill)
            .catch(defer.reject);
        return defer.promise;
    },

    afterLaunch: exitCode => new Promise(resolve => reporter.afterLaunch(resolve.bind(this, exitCode))),

    onCleanUp: () => {
        const defer = protractor.promise.defer();
        prepareCilantro.cleanUp(frontendUrl)
            .then(defer.fulfill)
            .catch(defer.reject);
        return defer.promise;
    },

    promisesDelay: 0

};
