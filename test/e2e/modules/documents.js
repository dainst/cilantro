const e = require("./elements");
const EC = protractor.ExpectedConditions;

const DocumentsPage = function() {

    this.getStagingAreaFiles = () => e.documents.treeViewItemsNames
        .then(list => Promise.all(list.map(item => item.getText())));

    this.waitForLoaded = docNr =>
        browser.wait(EC.visibilityOf(e.documents.treeViewItemsTopLevel.get(docNr).all(by.css('.loaded')).first(), 50));

};

module.exports = new DocumentsPage();