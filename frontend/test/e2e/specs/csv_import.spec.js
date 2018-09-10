const e = require("../modules/elements");
const a = require('../modules/actions');
const ot = require('../modules/overview_table');

describe('csv import dialogue', () => {

    beforeEach(done =>
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(1).element(by.css('.load')).click)
            .then(a.waitForModal)
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
        a.getRecognizedCSVColumnTypes().then(columns => {
           expect(columns[0]).toEqual("author");
           expect(columns[1]).toEqual("pages");
        });
    });

    it('try to identify columns correctly by there headline', () => {
        e.csv.textField.clear().sendKeys("Title,author\nUbik,Philipp k. Dick\nPattern recognition,William Gibson");
        e.csv.takeData.click();
        a.getRecognizedCSVColumnTypes().then(columns => {
            expect(columns[0]).toEqual("title");
            expect(columns[1]).toEqual("author");
        });
    });

    it('support different author delimiters', () => {
        e.csv.textField.clear().sendKeys("Author\nPeter Lustig|Donald Duck");
        e.csv.delimiterSelect.element(by.css("[value=',']")).click();
        e.csv.moreOptions.click();
        e.csv.authorDelimiter.element(by.css("[value='|']")).click();
        e.csv.takeData.click();
        e.csv.confirm.click();
        e.documents.proceedBtn.click();
        expect(e.overview.table.all(by.css('.authorlist tbody tr')).count()).toEqual(2);
    });

    it('support different author formats', () => {
        e.csv.textField.clear().sendKeys("Author\nLustig,Peter;Duck, Donald");
        e.csv.delimiterSelect.element(by.css("[value='|']")).click();
        e.csv.moreOptions.click();
        e.csv.authorFormat.element(by.css("[value='1']")).click();
        e.csv.takeData.click();
        e.csv.confirm.click();
        e.documents.proceedBtn.click();
        const authorbox = e.overview.table.all(by.css('.authorlist tbody tr'));
        expect(authorbox.count()).toEqual(2);
        expect(authorbox.all(by.model('author.lastname')).last().getAttribute("value")).toEqual("Duck");
        expect(authorbox.all(by.model('author.firstname')).last().getAttribute("value")).toEqual("Donald");
        expect(authorbox.all(by.model('author.lastname')).first().getAttribute("value")).toEqual("Lustig");
        expect(authorbox.all(by.model('author.firstname')).first().getAttribute("value")).toEqual("Peter");
    });

    it('warn, if column widths are deviant', () => {
        e.csv.textField.sendKeys(",someshit");
        e.csv.takeData.click();
        expect(e.csv.deviantColumnsWarning.isDisplayed()).toBeTruthy();
    });

});