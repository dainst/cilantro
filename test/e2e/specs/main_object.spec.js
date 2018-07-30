const e = require("../util/elements");
const a = require('../modules/actions');
const message = require('../modules/messages');
const mo = require('../modules/mainobject');
const so = require('../modules/subobject');

describe('mainobject view', () => {
    describe('editables', () => {
        it("number editable should be limited to numbers", () => {
            browser.get(browser.baseUrl);
            mo.getRowContent("Year").then(cell => {
                cell.element("input").clear.sendKeys("abc");
                expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
            });
        });

        it("should load some journal data codes from ojc cilantro plugin api", () => {
            browser.get(browser.baseUrl);
            mo.getRowContent("OJS: Journal Code")
                .then(cell => cell.all(by.css("option")).first().click)
                .then(e.home.startBtn.click)
                .then(e.documents.treeViewItemsTopLevel.get(2).all(by.css('.load')).first().click)
                .then(message.waitForMessage)
                .then(e.documents.proceedBtn.click)
                .then(e.overview.proceedBtn.click)
                .then(() => so.getRowContent("Language"))
                .then(cell => {
                    expect(cell.all(by.css("label")).get(0).getText()).toBe("German");
                    expect(cell.all(by.css("label")).get(1).getText()).toBe("English");
                    expect(cell.all(by.css("label")).get(2).getText()).toBe("French");
                    expect(cell.all(by.css("label")).get(3).getText()).toBe("Italian");
                    expect(cell.all(by.css("label")).get(4).getText()).toBe("Spanish");
                });
        });

        // TODO: make 1 test out of those two
        it("should load some journal data codes from ojc cilantro plugin api (2)", () => {
            browser.get(browser.baseUrl);
            mo.getRowContent("OJS: Journal Code")
                .then(cell => cell.all(by.css("option")).first().click)
                .then(e.home.startBtn.click)
                .then(e.documents.treeViewItemsTopLevel.get(2).all(by.css('.load')).first().click)
                .then(message.waitForMessage)
                .then(e.documents.proceedBtn.click)
                .then(e.overview.proceedBtn.click)
                .then(() => so.getRowContent("Language"))
                .then(cell => {
                    expect(cell.all(by.css("label")).get(0).getText()).toBe("English");
                });
        });


    });


});