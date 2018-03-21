var elements = require("../util/elements");

var Messages = function() {

    this.classOfMain = function() {
        return elements.message.main.getAttribute("class");
    };

};

module.exports = new Messages();
