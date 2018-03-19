var elements = require("../util/elements");

var path = require('path');
var remote = require('../../../node_modules/selenium-webdriver/remote');

var EC = protractor.ExpectedConditions;

var Actions = function() {

    this.login = function(success = true) {
        var correctPassword = require("../util/readSettings").get('password');
        var password = (success == false) ? correctPassword + "wrong": correctPassword;
        elements.login.passwordInput.sendKeys(password);
    };

    this.uploadFile = function(file = '../ressources/e2e-testing.pdf') {
        browser.setFileDetector(new remote.FileDetector());
        var absolutePath = path.resolve(__dirname, file);
        browser.wait(EC.presenceOf(elements.upload.fileElem));
        elements.upload.fileElem.sendKeys(absolutePath);
    };

    this.closeTab = function() {
        browser.getAllWindowHandles().then(function (handles) {
            browser.driver.switchTo().window(handles[1]);
            browser.driver.close();
            browser.driver.switchTo().window(handles[0]);
        });
    };

    this.countArticles = function() {
        // TODO: needs to be more elegant!!
        browser.sleep(2000);
        return elements.articles.articleView.count();
    }
};

module.exports = new Actions();
