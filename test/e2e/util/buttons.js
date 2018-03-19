var elements = require("../util/elements");

var EC = protractor.ExpectedConditions;

var Buttons = function() {

    this.startImport = function() {
        return elements.start.startBtn.click;
    };

    this.proceed = function() {
        browser.wait(EC.visibilityOf(elements.publish.proceedBtn));
        return elements.publish.proceedBtn.click;
    };

    this.uploadPub = function() {
        return elements.publish.uploadBtn.click;
    };


    this.restart = function() {
        return elements.restart.restartBtn.click;
    };

    this.confirmRestart = function() {
        return elements.restart.confirmRestartBtn.click;
    };


    this.addArticle = function() {
        return elements.articles.addArticleBtn.click;
    };

    this.confirmArticle = function() {
        return elements.articles.confirmBtn.click;
    };

    this.dismissArticle = function() {
        return elements.articles.dismissBtn.click;
    };

    this.deleteArticle = function() {
        browser.wait(EC.visibilityOf(elements.articles.deleteArticleBtn));
        return elements.articles.deleteArticleBtn.click;
    };


    this.zenonMarkMissing = function() {
        return elements.zenon.markMissing.click;
    };

    this.zenonReportMissing = function() {
        return elements.zenon.reportMissing.click;
    };

    this.zenonDownloadXML = function() {
        return elements.zenon.downloadLink.click;
    };


    this.takeCsvData = function() {
        return elements.csv.takeData.click;
    };

    this.confirmCsv = function() {
        return elements.csv.confirm.click;
    };

};

module.exports = new Buttons();
