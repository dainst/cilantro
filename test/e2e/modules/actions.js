let elements = require("../util/elements");

let path = require('path');
let remote = require('../../../node_modules/selenium-webdriver/remote');

let EC = protractor.ExpectedConditions;

let Actions = function() {

    function toggleNavbar() {
        return browser.wait(EC.visibilityOf(elements.navbar.toggle), 10)
            .then(elements.navbar.toggle.click)
            .catch(function(){/*Navbar expanded. Doing nothing*/});
    }

    this.clickNavbarButton = function(button) {
        return toggleNavbar()
            .then(elements.navbar[button].click)
            .then(toggleNavbar)
    };

    this.uploadFile = function(file = '../ressources/e2e-testing.pdf') {
        browser.setFileDetector(new remote.FileDetector());
        let absolutePath = path.resolve(__dirname, file);
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

    this.waitForModal = () => browser.wait(EC.presenceOf(elements.modal, 5000));

};

module.exports = new Actions();
