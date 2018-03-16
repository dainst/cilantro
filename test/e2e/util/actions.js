var elements = require("../util/elements");

var path = require('path');
var remote = require('../../../node_modules/selenium-webdriver/remote');

var Actions = function() {

    this.uploadFile = function(file = '../ressources/e2e-testing.pdf') {
        browser.setFileDetector(new remote.FileDetector());
        var absolutePath = path.resolve(__dirname, file);
        elements.upload.fileElem.sendKeys(absolutePath);
    };

    this.login = function(success = true) {
        var password = require("../util/readSettings").get('password')
        if (success === false) {
            password = password + "wrong";
        }

        elements.login.passwordInput.sendKeys(password);
    };

    this.closeTab = function() {
        browser.getAllWindowHandles().then(function (handles) {
            browser.driver.switchTo().window(handles[1]);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
        });
    };
};

module.exports = new Actions();
