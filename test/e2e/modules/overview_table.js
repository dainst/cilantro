const e = require("../util/elements");
// let path = require('path');
// let remote = require('../../../node_modules/selenium-webdriver/remote');
const EC = protractor.ExpectedConditions;

const OverviewTable = function() {

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

    this.getThumbnailBinaryStart = rowNr =>
        this.getCell(rowNr, "Preview")
            .then(cell => cell.element(by.css("img")).getAttribute("src"))
            .then(src => src.substr(0, 80));

};

module.exports = new OverviewTable();