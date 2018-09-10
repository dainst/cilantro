const e = require("./elements");
const documents = require('../modules/documents');
const EC = protractor.ExpectedConditions;

const Subobject = function() {

    this.goToSubObject = docNr => browser.get(browser.baseUrl)
        .then(e.home.startBtn.click)
        .then(e.documents.treeViewItemsTopLevel.get(docNr).all(by.css('.load')).first().click)
        .then(documents.waitForLoaded(docNr))
        .then(e.documents.proceedBtn.click)
        .then(browser.wait(EC.visibilityOf(e.overview.table), 20))
        .then(e.overview.proceedBtn.click)
        .then(browser.wait(EC.visibilityOf(e.subobject.table), 20));

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