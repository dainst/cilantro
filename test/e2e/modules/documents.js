const e = require("../util/elements");
const EC = protractor.ExpectedConditions;

const DocumentsPage = function() {
    this.getStagingAreaFiles = () => e.documents.treeViewItemsNames
        .then(list => Promise.all(list.map(item => item.getText())))

};

module.exports = new DocumentsPage();