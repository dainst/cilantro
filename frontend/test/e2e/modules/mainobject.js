const e = require("./elements");

const Mainobject = function() {

    this.getRowContent = id => e.mainobject.table.element(by.css(".row-" + id));

};

module.exports = new Mainobject();
