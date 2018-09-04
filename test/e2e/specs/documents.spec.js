const e = require("../modules/elements");
const a = require('../modules/actions');
const message = require('../modules/messages');
const documents = require('../modules/documents');
const prepareCilantro = require('../util/prepare_cilantro.js');


describe('documents page', () => {

    it('should show tree of staging dir', () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(expect(e.documents.treeViewItemsTopLevel.count()).toEqual(5))
            .then(expect(e.documents.treeViewItems.count()).toEqual(8));
    });

    it('should toggle sub-directories', () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(e.documents.toggleBranchBtn.click)
            .then(expect(e.documents.treeViewItemsTopLevel.get(3).all(by.css("li")).count()).toEqual(3));
    });

    it('should load pdf file and create a document if selected so', () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(2).element(by.css('.load')).click)
            .then(message.waitForMessage)
            .then(message.getStats)
            .then(stats => {
                expect(stats.Analyzed).toEqual(1);
                expect(stats.Loaded).toEqual(1);
                expect(stats.Files).toEqual(1);
                expect(stats.Thumbnails).toEqual(1);
            })
    });

    it('should load pdf file and NOT create a document if selected so', () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(e.documents.fileHandlerArea.element(by.css(".file-handler-pdf-empty > label")).click)
            .then(e.documents.treeViewItemsTopLevel.get(2).element(by.css('.load')).click)
            .then(message.waitForMessage)
            .then(message.getStats)
            .then(stats => {
                expect(stats.Analyzed).toEqual(0);
                expect(stats.Loaded).toEqual(1);
                expect(stats.Files).toEqual(1);
                expect(stats.Thumbnails).toEqual(0);
            })
            .then(e.documents.proceedBtn.click)
            .then(expect(e.overview.tableRows.count()).toEqual(0))
    });

    it('should handle a broken file without big drama', done => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(() => prepareCilantro.silent(true))
            .then(() => prepareCilantro.clearSingleFile(browser.baseUrl, 'e2e-testing-broken_file.csv'))
            .then(e.documents.treeViewItemsTopLevel.get(0).element(by.css('.load')).click)
            .then(message.waitForMessage)
            .then(() => expect(message.getClassOfMain()).toBe("danger"))
            .then(() => prepareCilantro.prepare(browser.baseUrl))
            .then(() => prepareCilantro.silent(false))
            .then(done);

    });

    it('should load all files of a directory', () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(3).all(by.css('.load')).first().click)
            .then(documents.waitForLoaded(3))
            .then(message.getStats)
            .then(stats => {
                expect(stats.Analyzed).toEqual(3);
                expect(stats.Loaded).toEqual(3);
                expect(stats.Files).toEqual(3);
                expect(stats.Thumbnails).toEqual(3);
            })
            .then(e.documents.proceedBtn.click)
            .then(expect(e.overview.tableRows.count()).toEqual(3))
    });

    it('should open the csv import dialogue after loading a csv file', () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(1).element(by.css('.load')).click)
            .then(a.waitForModal)
            .then(expect(e.csv.textField.getAttribute('value')).not.toEqual(""))
            .then(e.csv.takeData.click)
            .then(e.csv.ignoreFirstRow.click)
            .then(e.csv.confirm.click)
            .then(e.documents.proceedBtn.click)
            .then(expect(e.overview.tableRows.count()).toEqual(2))

    });



});