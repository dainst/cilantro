const e = require("./elements");

const Mainobject = function() {

    this.getRowTitles = () => new Promise((resolve, reject) =>
        e.mainobject.tableRows
            .then(rows => Promise.all(rows.map(row => row.all(by.css("td")).get(0).getText()))
                .then(resolve).catch(reject)));

    this.getRowContent = title => new Promise((resolve, reject) =>
        this.getRowTitles()
            .then(titles => e.mainobject.tableRows.get(titles.indexOf(title)))
            .then(resolve).catch(reject));
};

module.exports = new Mainobject();