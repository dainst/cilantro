const e = require("../modules/elements");
const a = require('../modules/actions');
const so = require('../modules/subobject');
const mo = require('../modules/mainobject');
const j = require('../modules/jobs');
const message = require('../modules/messages');
const EC = protractor.ExpectedConditions;


describe('publish page', () => {

    fit("should not allow start job if no articles are staged", () => {
        so.goToSubObject(2);
        browser.wait(EC.presenceOf(e.navbar.publish), 20000);
        expect(e.navbar.publish.isDisplayed()).toBeFalsy();
        browser.wait(EC.visibilityOf(e.subobject.confirmBtn), 20000);
        e.subobject.confirmBtn.click();
        expect(e.navbar.publish.isDisplayed()).toBeTruthy();
    });

    xit("should not allow start job if mainobject data is no valid", () => {
        so.goToSubObject(2);
        browser.wait(EC.visibilityOf(e.subobject.confirmBtn), 5000);
        e.subobject.confirmBtn.click();
        expect(e.publish.uploadBtn.isPresent()).toBeFalsy();
        Promise.all([mo.getRowContent("volume"), mo.getRowContent("number"), mo.getRowContent("ojs_journal_code")])
            .then(cells => {
                cells[0].element(by.css("input")).sendKeys("2018");
                cells[1].element(by.css("input")).sendKeys("18");
                cells[2].all(by.css("option")).get(1).click();
                browser.wait(EC.presenceOf(e.publish.uploadBtn), 20000);
                expect(e.publish.uploadBtn.isPresent()).toBeTruthy();
            });
    });

    xit("should start job if everything is okay", () => {
        so.goToSubObject(2);
        browser.wait(EC.visibilityOf(e.subobject.confirmBtn), 5000);
        e.subobject.confirmBtn.click();
        browser.wait(EC.visibilityOf(e.mainobject.table), 20000);
        Promise.all([mo.getRowContent("volume"), mo.getRowContent("number"), mo.getRowContent("ojs_journal_code")])
            .then(cells => {
                cells[0].element(by.css("input")).sendKeys("2018");
                cells[1].element(by.css("input")).sendKeys("18");
                var option = cells[2].all(by.css("option")).get(1);
                browser.wait(EC.visibilityOf(option), 20000);
                option.click();
                e.publish.uploadBtn.click();
                expect(j.getLastJobStatus()).toEqual('Accepted');
            });
    });

});
