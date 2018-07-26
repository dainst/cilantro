const e = require("../util/elements");
const a = require('../modules/actions');
const message = require('../modules/messages');
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

        fit('should adopt data from zenon into current article', () => {
            so.goToSubObject(2);
            e.zenon.searchBox.clear().sendKeys("Equus");
            browser.sleep(500);
            a.scrollTo(e.zenon.loadMore).then(() => {
                e.zenon.loadMore.click();
                expect(e.zenon.resultRows.count()).toEqual(20);
            });

        });


    });
});