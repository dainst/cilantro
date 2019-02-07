const Jobs = function() {

    this.getLastJobStatus = (id) => {
        return element.all(by.css(".job .status")).last().getText();
    }

}

module.exports = new Jobs();
