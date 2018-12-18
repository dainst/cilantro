const e = require("../modules/elements");
const a = require('../modules/actions');
const message = require('../modules/messages');
const mo = require('../modules/mainobject');
const so = require('../modules/subobject');
const LoginHelper = require("../util/login_helper");
const EC = protractor.ExpectedConditions;

describe('mainobject view', () => {
    describe('editables', () => {
        it("number editable should be limited to numbers", () => {
            LoginHelper.get(browser, browser.baseUrl);
            mo.getRowContent("Year").then(cell => {
                cell.element(by.css("input")).clear().sendKeys("abc");
                expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
            });
        });
        it("should load some journal data codes from ojs cilantro plugin api", () => {
            LoginHelper.get(browser, browser.baseUrl);
            e.home.importJournal.click();
            e.home.startBtn.click();
            a.clickNavbarButton("articles");
            browser.wait(EC.visibilityOf(e.subobject.add), 2000);
            e.subobject.add.click();
            so.getRowContent("Language").then(cell => {
                // without selected a journal we get default values
                expect(cell.all(by.css("label")).get(1).getText()).toBe("English");
                expect(cell.all(by.css("label")).get(0).getText()).toBe("German");
            }).then(() => {
                a.restart();
                // the journal 0 is selected by default
                e.home.importJournal.click();
                e.home.startBtn.click();
                a.clickNavbarButton("articles");
                e.subobject.add.click();
                so.getRowContent("Language").then(cell => {
                    expect(cell.all(by.css("label")).get(1).getText()).toBe("English");
                    expect(cell.all(by.css("label")).get(0).getText()).toBe("German");
                });
            });



        });

    });


});
