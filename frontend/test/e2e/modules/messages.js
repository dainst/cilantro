const elements = require("./elements");
const EC = protractor.ExpectedConditions;

const Messages = function() {

    this.getClassOfMain = () => new Promise(resolve => elements.message.main.getAttribute("class")
        .then(cls => resolve(cls.split(" ").filter(s => s.substr(0,6) === "alert-")[0].replace("alert-", ""))));

    this.getStats = () => new Promise((resolve, reject) =>
        elements.stats.all.then(stats =>
            Promise.all(stats.map(stat => Promise.all([stat.getText(), stat.element(by.css('.badge')).getText()])))
                .then(stats => resolve(stats.reduce((acc, stat) => (acc[stat[0].substr(2)] = parseInt(stat[1]), acc), {})))
                .catch(reject)
            ));

    this.waitForMessage = () => browser.wait(EC.visibilityOf(elements.message.main), 5000);

    this.clearMessages = () => {
        browser.actions().mouseMove(elements.message.main).perform();
        elements.message.clear.click();
    }

};

module.exports = new Messages();
