var elements = require("../util/elements");

var action = require('../util/actions');
var check = require('../util/checks');
var select = require('../util/selectors');
var button = require('../util/buttons');
var message = require('../util/messages');
var input = require('../util/inputs');

describe('importer', function() {

    beforeAll(function() {
        browser.driver.manage().window().maximize();
    });

    it('should upload a pdf-file', function() {
        browser.get(browser.baseUrl)
            .then(action.login())
            .then(select.protocol())
            .then(action.uploadFile())
            .then(button.startImport())
            .then(check.numberOfArticles(1))
    });

    it('should only start after right password input', function() {
        browser.get(browser.baseUrl)
            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeFalsy())

            .then(action.login(false))
            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeTruthy())

            .then(select.protocol())
            .then(select.file())
            .then(button.startImport())
            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeFalsy())
            .then(expect(message.classOfMain()).toContain("alert-danger"))

            .then(action.login())
            .then(select.protocol())
            .then(select.file())
            .then(button.startImport())
            .then(expect(message.classOfMain()).toContain("alert-success"))
    });

    it('should start the testdata protocol', function() {
        browser.get(browser.baseUrl)
            .then(action.login())
            .then(select.protocol('testdata'))
            .then(button.startImport())
            .then(expect(message.classOfMain()).toContain("alert-success"))
    });

    it('should abort and restart the import process', function() {
        browser.get(browser.baseUrl)
            .then(action.login())
            .then(select.protocol())
            .then(select.file())
            .then(button.startImport())
            .then(expect(message.classOfMain()).toContain("alert-success"))

            .then(button.restart())
            .then(button.confirmRestart())
            .then(expect(elements.start.protocolSelect.isDisplayed()).toBeTruthy())

    });

    it('should publish a file', function() {
        browser.get(browser.baseUrl)
            .then(action.login())
            .then(select.protocol())
            .then(select.file())
            .then(button.startImport())
            .then(expect(message.classOfMain()).toContain("alert-success"))

            .then(button.proceed())
            .then(button.confirmArticle())
            .then(button.uploadPub())
            .then(input.year())
            .then(select.journalCode())
            .then(button.uploadPub())
            // dev mode without ojs
            .then(expect(message.classOfMain()).toContain("alert-danger"))
            // production mode with ojs
            // .then(expect(message.classOfMain()).toContain("alert-success"))
    });

    it('should report a file to zenon', function() {
        browser.get(browser.baseUrl)
            .then(action.login())
            .then(select.protocol())
            .then(select.file())
            .then(button.startImport())
            .then(expect(message.classOfMain()).toContain("alert-success"))

            .then(button.proceed())
            .then(button.zenonMarkMissing())
            .then(button.confirmArticle())
            .then(button.uploadPub())
            .then(input.year())
            .then(select.journalCode())
            .then(button.zenonReportMissing())
            .then(button.zenonDownloadXML())
            .then(action.closeTab())

    });

    it('should add and delete an article', function() {
        browser.get(browser.baseUrl)
            .then(action.login())
            .then(select.protocol())
            .then(select.file())
            .then(button.startImport())
            .then(expect(message.classOfMain()).toContain("alert-success"))
            .then(check.numberOfArticles(1))

            .then(button.deleteArticle())
            .then(check.numberOfArticles(0))

            .then(button.addArticle())
            .then(check.numberOfArticles(1))
    });

    it('should import data with csv protocol', function() {
        var articlesInCsv = 2;
        browser.get(browser.baseUrl)
            .then(action.login())
            .then(select.protocol('csv_import'))
            .then(select.file())
            .then(button.startImport())
            .then(expect(message.classOfMain()).toContain("alert-success"))

            .then(action.uploadFile('../ressources/e2e-testing.csv'))
            .then(button.takeCsvData())
            .then(input.ignoreFirstRow())
            .then(button.confirmCsv())
            .then(check.numberOfArticles(articlesInCsv))

    });

    it('should not be able to upload without articles', function(){
        browser.get(browser.baseUrl)
          .then(action.login())
          .then(select.protocol())
          .then(select.file())
          .then(button.startImport())
          .then(button.proceed())
          .then(button.dismissArticle())
          .then(button.uploadPub())

          .then(expect(elements.publish.uploadBtn.count()).toEqual(0))
    })

});
