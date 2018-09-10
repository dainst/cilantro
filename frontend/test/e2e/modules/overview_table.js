const e = require("./elements");
const documents = require('../modules/documents');
const imageComparer = require("../util/image_comparer");

const OverviewTable = function() {

    this.goToOverview = (docNr) => browser.get(browser.baseUrl)
        .then(e.home.startBtn.click)
        .then(e.documents.treeViewItemsTopLevel.get(docNr).all(by.css('.load')).first().click)
        .then(documents.waitForLoaded(docNr))
        .then(e.documents.proceedBtn.click);

    this.getAvailableColumnNames = () => new Promise((resolve, reject) =>
        e.overview.tableHeadColumns
            .then(columns => Promise.all(columns.map(column => column.getText()))
                .then(resolve).catch(reject)));

    this.getVisibleColumnNames = () =>
        this.getAvailableColumnNames()
            .then(columnNames => columnNames.filter(colName => colName !== ""));

    this.getCell = (rowNr, colLabel) =>
        this.getAvailableColumnNames()
            .then(columnNames => e.overview.tableRows.get(rowNr).all(by.xpath("./td")).get(columnNames.indexOf(colLabel)));

    this.getThumbnailDataUri = rowNr =>
        this.getCell(rowNr, "Preview")
            .then(cell => cell.element(by.css("img")).getAttribute("src"));

    this.compareThumbnailWithImage = (rowNr, imageName) => new Promise((resolve, reject) =>
        this.getThumbnailDataUri(rowNr)
            .then(data => imageComparer.compareDataWithFile(data, imageName))
            .then(resolve).catch(reject));

    this.getRowButton = (rowNr, button) =>
        e.overview.tableRows.get(rowNr).all(by.xpath("./td")).last().element(by.css(".btn.so-btn-" + button));

    this.getRowTitle = (rowNr) =>
        this.getCell(rowNr, "Title").then(cell => cell.element(by.css('input')).getAttribute("value"));
};

module.exports = new OverviewTable();