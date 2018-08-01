const e = require("./elements");

const DocumentsPage = function() {
    this.getStagingAreaFiles = () => e.documents.treeViewItemsNames
        .then(list => Promise.all(list.map(item => item.getText())))

};

module.exports = new DocumentsPage();