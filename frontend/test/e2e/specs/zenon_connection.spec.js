const e = require("../modules/elements");
const a = require('../modules/actions');
const so = require('../modules/subobject');

describe('subobject view', () => {
    describe('zenon connection', () => {
        it('should show search results', () => {
            so.goToSubObject(2);
            e.zenon.searchBox.clear().sendKeys("Searchresult Impossible");
            e.zenon.submit.click();
            expect(e.zenon.resultCount.getText().then(v => parseInt(v))).toEqual(0);
            expect(e.zenon.resultRows.count()).toEqual(0);
            e.zenon.searchBox.clear().sendKeys("magister Equitum");
            expect(e.zenon.resultCount.getText().then(v => parseInt(v))).toBeGreaterThan(0);
            expect(e.zenon.resultRows.count()).toBeGreaterThan(0);
        });

        it('should adopt data from zenon into current article', () => {
            so.goToSubObject(2);
            e.zenon.searchBox.clear().sendKeys("magister Equitum");
            e.zenon.resultRows.first().click();
            e.zenon.adopt.click();
            so.getRowContent("Title").then(cell => {
                const input = cell.element(by.css("input"));
                expect(input.getAttribute("value")).toEqual("The missing magister equitum.");
            });
            so.getRowContent("Zenon-Id").then(cell => {
                const input = cell.element(by.css("input"));
                expect(input.getAttribute("value")).toEqual("001175390");
            });
            so.getRowContent("Language").then(cell => {
                const input = cell.element(by.css("input[type=\"text\"]"));
                expect(input.getAttribute("value")).toEqual("en_US");
            });
            so.getRowContent("Date of Publishing").then(cell => {
                const input = cell.all(by.css("input")).first();
                expect(input.getAttribute("value")).toEqual("1997");
            });
            so.getRowContent("Range of Pages").then(cell => {
                const input = cell.all(by.css("input")).first();
                expect(input.getAttribute("value")).toEqual("157");
            });
            so.getRowContent("Author").then(cell => {
                const input = cell.all(by.css("input")).last();
                expect(input.getAttribute("value")).toEqual("Ridley");
            });
        });

        it('should adopt data from zenon into current article', () => {
            so.goToSubObject(2);
            e.zenon.searchBox.clear().sendKeys("Equus");
            a.scrollTo(e.zenon.loadMore).then(() => {
                e.zenon.loadMore.click();
                expect(e.zenon.resultRows.count()).toEqual(20);
            });
        });

        it('should create new data from zenon', () => {
            so.goToSubObject(2);
            e.zenon.searchBox.clear().sendKeys("magister Equitum");
            e.zenon.resultRows.first().click();
            e.zenon.newArticle.click();

            expect(e.subobject.select.count()).toEqual(2);

            so.getRowContent("Title").then(cell => {
                const input = cell.element(by.css("input"));
                expect(input.getAttribute("value")).toEqual("The missing magister equitum.");
            });
        });

        it('should automatically fetch data from zenon if list of Ids is provided', () => {
            browser.get(browser.baseUrl);
            e.home.startBtn.click();
            e.documents.treeViewItemsTopLevel.get(4).element(by.css('.load')).click();
            a.waitForModal();
            e.csv.takeData.click();
            e.csv.autoFetchFromZenon.click();
            e.csv.confirm.click();
            e.documents.proceedBtn.click();
            e.overview.proceedBtn.click();
            so.getRowContent("Title").then(cell => {
                const input = cell.element(by.css("input"));
                const title1 = "The missing magister equitum.";
                const title2  = "Equus : the horse in the Roman World ";
                // because order may vary, ansynchornous speed stuff
                expect([title1, title2]).toContain(input.getAttribute("value"));
            });
        });

        it('just should skip a row which Zenon-Ids is unknown', () => {
            browser.get(browser.baseUrl);
            e.home.startBtn.click();
            e.documents.treeViewItemsTopLevel.get(4).element(by.css('.load')).click();
            a.waitForModal();
            e.csv.textField.sendKeys("\n000000000");
            e.csv.takeData.click();
            e.csv.autoFetchFromZenon.click();
            e.csv.confirm.click();
            e.documents.proceedBtn.click();
            e.overview.proceedBtn.click();
            expect(e.subobject.select.count()).toEqual(2);
        });

    });
});