const e = require("./elements");
const message = require('../modules/messages');

const Publish = function() {

    this.goToPublish = docNr => browser.get(browser.baseUrl)
        .then(e.home.startBtn.click)
        .then(e.documents.treeViewItemsTopLevel.get(docNr).all(by.css('.load')).first().click)
        .then(message.waitForMessage)
        .then(e.documents.proceedBtn.click)
        .then(e.overview.proceedBtn.click);

};

module.exports = new Publish();