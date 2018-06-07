let elements = require("../util/elements");

let Selectors = function() {

    this.protocol = function(protocol = 'generic') {
        return elements.start.protocolSelect.element(by.css("[value='" + protocol + "']")).click;
    };

    this.file = function(file = 'e2e-testing.pdf') {
        return elements.start.fileSelect.element(by.css("[value='" + file + "']")).click
    };

    this.journalCode = function(code = 'test') {
        return elements.publish.select.get(1).element(by.css("[value='" + code + "']")).click
    };
    
};

module.exports = new Selectors();
