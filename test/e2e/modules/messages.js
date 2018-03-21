var elements = require("../util/elements");

var Messages = function() {

    this.classOfMain = function() {
        return elements.main.mainMessage.getAttribute("class");
    };

};

module.exports = new Messages();
