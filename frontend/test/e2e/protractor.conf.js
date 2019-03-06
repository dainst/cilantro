const fs = require("fs");
const process = require("process");
const failFast = require("protractor-fail-fast");

const prepareCilantro = require("./util/prepare_cilantro.js");

const frontendUrl = "http://localhost:7777";

exports.config = {
    chromeDriver : "../../node_modules/chromedriver/lib/chromedriver/chromedriver" + (process.platform === "win32" ? ".exe" : ""),
    baseUrl: frontendUrl,
    suites: {
       util: "./util/delays.js",
       tests: "specs/**.spec.js"
    },
    directConnect: true,
    exclude: [],
    chromeOnly: true,
    multiCapabilities: [{
        browserName: "chrome",
        chromeOptions: {
            args: [
                "--no-sandbox",
                // see https://stackoverflow.com/questions/50642308/org-openqa-selenium-webdriverexception-unknown-error-devtoolsactiveport-file-d
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--window-size=1920,1024"
            ]
        }
    }],
    allScriptsTimeout: 110000,
    getPageTimeout: 100000,
    framework: "jasmine2",
    jasmineNodeOpts: {
        isVerbose: false,
        showColors: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 600000
    },
    plugins: [
        {
            package: "protractor-console-plugin",
            failOnWarning: false,
            failOnError: false,
            logWarnings: false,
            exclude: []
        },
        failFast.init()
    ],

    onPrepare: () => {
        logFix = {
            specDone: function(result) {
                if(result.status.toString() != "disabled"){
                    console.log("\n"+result.fullName + " : "+ result.status);
                }
            }
        };
        jasmine.getEnv().addReporter(logFix);

        const defer = protractor.promise.defer();
        prepareCilantro.prepare(frontendUrl)
            .then(defer.fulfill)
            .catch(defer.reject);
        return defer.promise;
    },

    onCleanUp: () => {
        const defer = protractor.promise.defer();
        prepareCilantro.cleanUp(frontendUrl)
            .then(defer.fulfill)
            .catch(defer.reject);
        return defer.promise;
    },

    promisesDelay: 0

};
