var elements = require("../util/elements");
var password = require("../util/readSettings").get('password');

describe('importer', function() {

    it('should only start after right password input', function() {
        browser.driver.manage().window().maximize();
        browser.get(browser.baseUrl)
            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeFalsy())

            .then(elements.login.passwordInput.sendKeys(password + "wrong"))
            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeTruthy())
            .then(elements.start.protocolSelect.element(by.css("[value='generic']")).click)

            .then(elements.start.startBtn.click)
            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeFalsy())
            .then(expect(elements.main.mainMessage.getAttribute("class")).toContain("alert-danger"))

            .then(elements.login.passwordInput.sendKeys(password))
            .then(elements.start.protocolSelect.element(by.css("[value='generic']")).click)
            .then(elements.start.startBtn.click)
    });

    it('should start the testdata protocol', function() {
        browser.driver.manage().window().maximize();
        browser.get(browser.baseUrl)
            .then(elements.login.passwordInput.sendKeys(password))
            .then(elements.start.protocolSelect.element(by.css("[value='testdata']")).click)
            .then(elements.start.startBtn.click)

            .then(expect(elements.main.mainMessage.getAttribute("class")).toContain("alert-success"))
    });

    // code needs a fix here
    xit('should abort and restart the import process', function() {
        browser.driver.manage().window().maximize();
        browser.get(browser.baseUrl)
            .then(elements.login.passwordInput.sendKeys(password))
            .then(elements.start.protocolSelect.element(by.css("[value='generic']")).click)
            .then(elements.start.startBtn.click)

            .then(elements.restart.restartBtn.click)
            .then(elements.restart.confirmRestartBtn.click)

            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeTruthy())
    });

    // requires the BEISPIEL.pdf in the repository (e.g. chiron/data), call prepareTesting.sh if needed
    it('should publish a file', function() {
        browser.driver.manage().window().maximize();
        browser.get(browser.baseUrl)
            .then(elements.login.passwordInput.sendKeys(password))

            .then(elements.start.protocolSelect.element(by.css("[value='generic']")).click)
            .then(elements.start.fileSelect.element(by.css("[value='BEISPIEL.pdf']")).click)

            .then(elements.start.startBtn.click)
            // file must be analyzed
            .then(browser.driver.sleep(1000))
            .then(elements.publish.proceedBtn.click)
            .then(elements.publish.confirmBtn.click)
            .then(elements.publish.uploadBtn.click)

            .then(elements.publish.input.get(1).sendKeys('123'))
            .then(elements.publish.select.get(1).element(by.css("[value='aa']")).click)
            .then(elements.publish.finalBtn.click)

            // dev mode without ojs
            .then(expect(elements.main.mainMessage.getAttribute("class")).toContain("alert-danger"))
            // production mode with ojs
            // .then(expect(elements.main.mainMessage.getAttribute("class")).toContain("alert-success"))
    });

    it('should add and delete an article', function() {
        browser.driver.manage().window().maximize();
        browser.get(browser.baseUrl)
            .then(elements.login.passwordInput.sendKeys(password))

            .then(elements.start.protocolSelect.element(by.css("[value='generic']")).click)

            .then(elements.start.startBtn.click)

            .then(expect(elements.edit.articleView.isDisplayed()).toBeFalsy())
            .then(elements.edit.addArticleBtn.click)
            .then(expect(elements.edit.articleView.isPresent()).toBeTruthy())
            .then(elements.edit.deleteArticleBtn.click)
            .then(expect(elements.edit.articleView.isDisplayed()).toBeFalsy())
    });
});
