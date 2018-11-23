const e = require("./elements");
const documents = require('../modules/documents');
const EC = protractor.ExpectedConditions;
const LoginHelper = require("../util/login_helper");

const Subobject = function() {

    this.goToSubObject = docNr => LoginHelper.get(browser, browser.baseUrl)
        .then(() => {
            e.home.startBtn.click();
            e.documents.treeViewItemsTopLevel.get(docNr).all(by.css('.load')).first().click();
            documents.waitForLoaded(docNr);
            e.documents.proceedBtn.click();
            browser.wait(EC.visibilityOf(e.overview.table), 20000);
            e.overview.proceedBtn.click();
            browser.wait(EC.visibilityOf(e.subobject.table), 20000);
        });

    this.getRowTitles = () => new Promise((resolve, reject) =>
        e.subobject.tableRows
            .then(rows => Promise.all(rows.map(row => row.all(by.css("td")).get(0).getText()))
                .then(resolve).catch(reject)));

    this.getRowContent = title => new Promise((resolve, reject) =>
        this.getRowTitles()
            .then(titles => e.subobject.tableRows.get(titles.indexOf(title)))
                .then(resolve).catch(reject));
};

module.exports = new Subobject();