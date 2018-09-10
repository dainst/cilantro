const elements = require("./elements");
const path = require('path');
const remote = require('../../../node_modules/selenium-webdriver/remote');
const EC = protractor.ExpectedConditions;

const Actions = function() {

    this.toggleNavbar = function() {
        return browser.wait(EC.visibilityOf(elements.navbar.toggle), 10)
            .then(elements.navbar.toggle.click)
            .catch(function(){/*Navbar expanded. Doing nothing*/});
    };

    this.clickNavbarButton = function(button) {
        return this.toggleNavbar()
            .then(elements.navbar[button].click)
            .then(this.toggleNavbar)
    };

    this.restart = () => {
        this.clickNavbarButton("restart");
        //browser.wait(EC.visibilityOf(elements.restart.confirmBtn));
        return elements.restart.confirmBtn.click();
    };

    this.uploadFile = function(file = '../resources/staging/e2e-testing.pdf') {
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

    this.getRecognizedCSVColumnTypes = () => new Promise((resolve, reject) =>
        elements.csv.importTableColumns
            .then(columns => Promise.all(columns.map(column => column.getAttribute("value")))
                .then(resolve).catch(reject)));


    this.waitForModal = () => browser.wait(EC.presenceOf(elements.modal, 5000));

    this.scrollTo = element => browser.executeScript('arguments[0].scrollIntoView()', element.getWebElement());

    this.switchToNewTab = () => new Promise((resolve, reject) =>
        browser.getAllWindowHandles()
            .then(handles => {browser.switchTo().window(handles[1]).then(resolve).catch(reject)}));

};

module.exports = new Actions();
