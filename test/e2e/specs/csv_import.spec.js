const e = require("../util/elements");
const action = require('../modules/actions');
const ot = require('../modules/overview_table');

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

    it('try to identify columns correctly by there content', () => {
        e.csv.textField.clear().sendKeys("Titel,3-5\nAnderer Titel,15-16");
        e.csv.takeData.click();
        action.getRecognizedCSVColumnTypes().then(columns => {
           expect(columns[0]).toEqual("author");
           expect(columns[1]).toEqual("pages");
        });
    });

    it('try to identify columns correctly by there headline', () => {
        e.csv.textField.clear().sendKeys("Title,author\nUbik,Philipp k. Dick\nPattern recognition,William Gibson");
        e.csv.takeData.click();
        action.getRecognizedCSVColumnTypes().then(columns => {
            expect(columns[0]).toEqual("title");
            expect(columns[1]).toEqual("author");
        });
    });

    xit('support different author delimiters', () => {
        e.csv.textField.clear().sendKeys("Author\nPeter Lustig|Donald Duck");
        e.csv.delimiterSelect.element(by.css("[value=',']")).click();
        e.csv.moreOptions.click();
        e.csv.authorDelimiter.element("[value='|']\"");
        e.csv.takeData.click();
        // TODO import and count authors in article
    });

    xit('support different author formats', () => {
        e.csv.textField.clear().sendKeys("Author\nLustig,Peter;Duck, Donald");
        e.csv.delimiterSelect.element(by.css("[value='1']")).click();
        e.csv.moreOptions.click();
        e.csv.authorFormat.element("");
        e.csv.takeData.click();
        // TODO import and count authors in article
    });

    it('warn, if column widths are deviant', () => {
        e.csv.textField.sendKeys(",someshit");
        e.csv.takeData.click();
        expect(e.csv.deviantColumnsWarning.isDisplayed()).toBeTruthy();
    });

});