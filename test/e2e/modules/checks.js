var elements = require("../util/elements");

var remote = require('../../../node_modules/selenium-webdriver/remote');

var EC = protractor.ExpectedConditions;

var Checks = function() {

    this.numberOfArticles = function(expected = 0) {
        (expected !== 0) ? browser.wait(EC.presenceOf(elements.article.entry)) : null;
        return expect(elements.article.entry.count()).toEqual(expected);
    };

};

module.exports = new Checks();
