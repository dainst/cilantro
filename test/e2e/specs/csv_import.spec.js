const e = require("../util/elements");
const action = require('../modules/actions');
const message = require('../modules/messages');
const input = require('../modules/inputs');

describe('csv import dialogue', () => {

    beforeEach(done =>
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(0).element(by.css('.load')).click)
            .then(action.waitForModal)
            .then(done)
    );

    it('identify seven columns', () => {
        e.csv.takeData.click();
        expect(e.csv.importTableColumns.count()).toEqual(7);
    });

    it('guess the correct delimiter', () => {
        e.csv.textField.clear().sendKeys("col1|col2\nvalue1|value2");
        expect(e.csv.delimiterSelect.getAttribute("value")).toEqual("|");
    });

    it('identify only one column if wrong delimiter is selected and show warning', () => {
        e.csv.delimiterSelect.element(by.css("[value='|']")).click();
        expect(e.csv.delimiterWarning.isDisplayed()).toBeTruthy();
        e.csv.takeData.click();
        expect(e.csv.importTableColumns.count()).toEqual(1);
    });



});