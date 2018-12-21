const e = require("./elements");
const documents = require('../modules/documents');
const EC = protractor.ExpectedConditions;
const LoginHelper = require("../util/login_helper");

const Subobject = function() {

    this.goToSubObject = docNr => LoginHelper.get(browser, browser.baseUrl)
        .then(() => {
            e.home.importJournal.click();
            e.home.startBtn.click();
            e.documents.treeViewItemsTopLevel.get(docNr).all(by.css('.load')).first().click();
            documents.waitForLoaded(docNr);
            e.documents.proceedBtn.click();
            browser.wait(EC.visibilityOf(e.overview.table), 20000);
            e.overview.proceedBtn.click();
            browser.wait(EC.visibilityOf(e.subobject.table), 20000);
        });

    this.getRowContent = id => e.subobject.table.element(by.css(".row-" + id));

};

module.exports = new Subobject();
