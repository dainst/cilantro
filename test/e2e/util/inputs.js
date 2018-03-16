var elements = require("../util/elements");

var Inputs = function() {

    this.year = function(value = '123') {
        elements.publish.input.get(1).sendKeys(value);
    };

    this.fileSelect = function(file = 'e2e-testing.pdf') {
        return elements.start.fileSelect.element(by.css("[value='" + file + "']")).click
    };
};

module.exports = new Inputs();
