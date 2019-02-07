const e = require("./elements");
const message = require('../modules/messages');
const LoginHelper = require("../util/login_helper");

const Publish = function() {

    this.goToPublish = docNr => LoginHelper.get(browser, browser.baseUrl)
        .then(e.home.importJournal.click)
        .then(e.home.startBtn.click)
        .then(e.documents.treeViewItemsTopLevel.get(docNr).all(by.css('.load')).first().click)
        .then(message.waitForMessage)
        .then(e.documents.proceedBtn.click)
        .then(e.overview.proceedBtn.click);

};

module.exports = new Publish();
