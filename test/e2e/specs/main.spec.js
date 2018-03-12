var elements = require("../util/elements");
var password = require("../util/masterPassword").get();

describe('importer', function() {

    it('should only start after right password input', function() {
        browser.get(browser.baseUrl)
            .then(expect(elements.main.protocolSelect.isDisplayed()).toBeFalsy())

            .then(elements.main.passwordInput.sendKeys(password + "wrong"))
            .then(expect(elements.main.protocolSelect.isDisplayed()).toBeTruthy())

            .then(elements.main.startBtn.click)
            .then(expect(elements.main.protocolSelect.isDisplayed()).toBeFalsy())
            .then(expect(elements.main.mainMessage.getAttribute("class")).toContain("alert-danger"))

            .then(elements.main.passwordInput.sendKeys(password))
            .then(elements.main.startBtn.click)
            .then(expect(elements.main.mainMessage.getAttribute("class")).toContain("alert-danger"))

            .then(elements.main.protocolSelect.element(by.css("[value='testdata']")).click)
            .then(elements.main.startBtn.click)
            .then(expect(elements.main.mainMessage.getAttribute("class")).toContain("alert-success"))
    });



});