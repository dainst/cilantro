const promisesDelay = require('../protractor.conf').config.promisesDelay;

function delayPromises(milliseconds) {
    const executeFunction = browser.driver.controlFlow().execute;

    browser.driver.controlFlow().execute = function() {
        const args = arguments;

        executeFunction.call(browser.driver.controlFlow(), function() {
            return protractor.promise.delayed(milliseconds);
        });

        return executeFunction.apply(browser.driver.controlFlow(), args);
    };
}

console.log("Set promises delay to " + promisesDelay + " ms.");

delayPromises(promisesDelay);
