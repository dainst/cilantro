const e = require("../util/elements");
const message = require('../modules/messages');

// let path = require('path');
// let remote = require('../../../node_modules/selenium-webdriver/remote');
const EC = protractor.ExpectedConditions;

const imageComparer = require("../util/image_comparer");


const OverviewTable = function() {

    this.goToOverview = () => browser.get(browser.baseUrl)
        .then(e.start.startBtn.click)
        .then(e.documents.treeViewItemsTopLevel.get(2).element(by.css('.load')).click)
        .then(message.waitForMessage)
        .then(e.documents.proceedBtn.click);

    this.getAvailableColumnNames = () => new Promise((resolve, reject) =>
        e.overview.tableHeadColumns
            .then(columns => Promise.all(columns.map(column => column.getText()))
                .then(resolve).catch(reject)));

    this.getVisibleColumnNames = () => new Promise((resolve, reject) =>
            this.getAvailableColumnNames()
                .then(columnNames => columnNames.filter(colName => colName !== ""))
                .then(resolve).catch(reject));

    this.getCell = (rowNr, colLabel) => new Promise((resolve, reject) =>
        this.getVisibleColumnNames()
            .then(columnNames => e.overview.tableRows.get(rowNr).all(by.css("td")).get(columnNames.indexOf(colLabel)))
            .then(resolve).catch(reject));

    this.getThumbnailDataUri = rowNr =>
        this.getCell(rowNr, "Preview")
            .then(cell => cell.element(by.css("img")).getAttribute("src"));

    this.compareThumbnailWithImage = (rowNr, imageName) => new Promise((resolve, reject) =>
        this.getThumbnailDataUri(rowNr)
            .then(data => imageComparer.compareDataWithFile(data, imageName))
            .then(resolve).catch(reject));
};

module.exports = new OverviewTable();