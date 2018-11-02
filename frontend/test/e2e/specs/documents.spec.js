const e = require("../modules/elements");
const a = require('../modules/actions');
const message = require('../modules/messages');
const documents = require('../modules/documents');
const prepareCilantro = require('../util/prepare_cilantro.js');
const LoginHelper = require("../util/login_helper");
const EC = protractor.ExpectedConditions;


describe('documents page', () => {

    it('should show tree of staging dir', () => {
        LoginHelper.get(browser, browser.baseUrl)
            .then(() => {
                e.home.startBtn.click();
                expect(e.documents.treeViewItemsTopLevel.count()).toEqual(5);
                expect(e.documents.treeViewItems.count()).toEqual(8);
            })
    });

    it('should toggle sub-directories', () => {
        LoginHelper.get(browser, browser.baseUrl)
            .then(() => {
                e.home.startBtn.click();
                e.documents.toggleBranchBtn.click();
                expect(e.documents.treeViewItemsTopLevel.get(3).all(by.css("li")).count()).toEqual(3);
            })
    });

    it('should load pdf file and create a document if selected so', () => {
        LoginHelper.get(browser, browser.baseUrl)
            .then(() => {
                e.home.startBtn.click();
                e.documents.treeViewItemsTopLevel.get(2).element(by.css('.load')).click();
                documents.waitForLoaded(2);
                browser.sleep(2000);
                message.getStats()
                    .then(stats => {
                        expect(stats.Analyzed).toEqual(1);
                        expect(stats.Loaded).toEqual(1);
                        expect(stats.Files).toEqual(1);
                        expect(stats.Thumbnails).toEqual(1);
                    });
            });

    });

    it('should load pdf file and NOT create a document if selected so', () => {
        LoginHelper.get(browser, browser.baseUrl)
            .then(() => {
                e.home.startBtn.click();
                e.documents.fileHandlerArea.element(by.css(".file-handler-pdf-empty > label")).click();
                e.documents.treeViewItemsTopLevel.get(2).element(by.css('.load')).click();
                documents.waitForLoaded(2);
                message.getStats()
                    .then(stats => {
                        expect(stats.Analyzed).toEqual(0);
                        expect(stats.Loaded).toEqual(1);
                        expect(stats.Files).toEqual(1);
                        expect(stats.Thumbnails).toEqual(0);
                        browser.wait(EC.visibilityOf(e.documents.proceedBtn), 2000);
                        e.documents.proceedBtn.click();
                        expect(e.overview.tableRows.count()).toEqual(0);
                    });
            })
    });

    it('should load all files of a directory', () => {
        LoginHelper.get(browser, browser.baseUrl)
            .then(() => {
                e.home.startBtn.click();
                e.documents.treeViewItemsTopLevel.get(3).all(by.css('.load')).first().click();
                documents.waitForLoaded(3);
                browser.sleep(2000);
                message.getStats().then(stats => {
                    browser.wait(EC.visibilityOf(e.documents.proceedBtn), 2000);
                    expect(stats.Analyzed).toEqual(3);
                    expect(stats.Loaded).toEqual(3);
                    expect(stats.Files).toEqual(3);
                    expect(stats.Thumbnails).toEqual(3);

                    browser.wait(EC.visibilityOf(e.documents.proceedBtn), 2000);
                    e.documents.proceedBtn.click();
                    browser.wait(EC.visibilityOf(e.overview.tableRows.first()), 2000);
                    expect(e.overview.tableRows.count()).toEqual(3);
                });
            })
    });

    it('should open the csv import dialogue after loading a csv file', () => {
        LoginHelper.get(browser, browser.baseUrl)
            .then(() => {
                e.home.startBtn.click();
                e.documents.treeViewItemsTopLevel.get(1).element(by.css('.load')).click();
                a.waitForModal();
                expect(e.csv.textField.getAttribute('value')).not.toEqual("");
                e.csv.takeData.click();
                e.csv.ignoreFirstRow.click();
                e.csv.confirm.click();
                e.documents.proceedBtn.click();
                expect(e.overview.tableRows.count()).toEqual(2);
            })
    });

});