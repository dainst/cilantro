const e = require("../util/elements");
//
const action = require('../modules/actions');
 //const check = require('../modules/checks');
// const select = require('../modules/selectors');
 //const button = require('../modules/buttons');
const message = require('../modules/messages');
 const input = require('../modules/inputs');
//// const EC = protractor.ExpectedConditions;

describe('documents page', () => {

    it('should show tree of staging dir', () => {
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(expect(e.documents.treeViewItemsTopLevel.count()).toEqual(4))
            .then(expect(e.documents.treeViewItems.count()).toEqual(7));
    });

    it('should toggle sub-directories', () => {
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(e.documents.toggleBranchBtn.click)
            .then(expect(e.documents.treeViewItemsTopLevel.last().all(by.css("li")).count()).toEqual(3));
    });

    it('should should load pdf file and create a document if selected so', () => {
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(2).element(by.css('.load')).click)
            .then(message.waitForMessage)
            .then(message.getStats)
            .then(stats => {
                expect(stats.Analyzed).toEqual(1);
                expect(stats.Loaded).toEqual(1);
                expect(stats.Files).toEqual(1);
                expect(stats.Thumbnails).toEqual(1);
            })
            //.then(e.documents.proceedBtn.click)
            // TODO proceed and look if there actually a thumbnail and a article
    });

    it('should should load pdf file and NOT create a document if selected so', () => {
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
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

        //.then(e.documents.proceedBtn.click)
        // TODO proceed and look if there actually a no thumbnail or article
    });

    it('should handle a broken file without big drama', () => {
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(1).element(by.css('.load')).click)
            .then(message.waitForMessage)
            .then(expect(message.getClassOfMain()).toBe("danger"));
    });

    it('should load all files of a directory', () => {
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(3).all(by.css('.load')).first().click)
            .then(message.waitForMessage)
            .then(browser.sleep(500))
            .then(message.getStats)
            .then(stats => {
                expect(stats.Analyzed).toEqual(3);
                expect(stats.Loaded).toEqual(3);
                expect(stats.Files).toEqual(3);
                expect(stats.Thumbnails).toEqual(3);
            })
        //.then(e.documents.proceedBtn.click)
        // TODO proceed and look if there actually a thumbnail and a article
    });

    fit('should open the csv import dialogue after loading a csv file', () => {
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(0).element(by.css('.load')).click)
            .then(action.waitForModal)
            .then(expect(e.csv.csvTextField.getAttribute('value')).not.toEqual(""))
            .then(e.csv.takeData.click)
            .then(e.csv.ignoreFirstRow.click)
            .then(e.csv.confirm.click)



        // TODO proceed and look if there actually a 2 thumbnails and articles

    });



});