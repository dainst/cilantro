const e = require("../modules/elements");
const a = require('../modules/actions');
const so = require('../modules/subobject');
const mo = require('../modules/mainobject');
const message = require('../modules/messages');
const EC = protractor.ExpectedConditions;


describe('publish page', () => {

    it("should not allow start job if no articles are staged", () => {
        so.goToSubObject(2);
        a.toggleNavbar();
        expect(e.navbar.publish.isDisplayed()).toBeFalsy();
        a.toggleNavbar();
        browser.wait(EC.visibilityOf(e.subobject.confirmBtn), 2000);
        e.subobject.confirmBtn.click();
        a.toggleNavbar();
        expect(e.navbar.publish.isDisplayed()).toBeTruthy();
    });

    it("should not allow start job if mainobject data is no valid", () => {
        so.goToSubObject(2);
        browser.wait(EC.visibilityOf(e.subobject.confirmBtn), 5000);
        e.subobject.confirmBtn.click();
        expect(e.publish.uploadBtn.isPresent()).toBeFalsy();
        Promise.all([mo.getRowContent("Volume"), mo.getRowContent("Number"), mo.getRowContent("OJS: Journal Code")])
            .then(cells => {
                cells[0].element(by.css("input")).sendKeys("2018");
                cells[1].element(by.css("input")).sendKeys("18");
                cells[2].all(by.css("option")).get(0).click();
                expect(e.publish.uploadBtn.isPresent()).toBeTruthy();
            });
    });

    // xit("should start job if everything is okay", () => {
    // @TODO: Fix this test, comment out for travis
    //     so.goToSubObject(2);
    //     browser.wait(EC.visibilityOf(e.subobject.confirmBtn), 5000);
    //     e.subobject.confirmBtn.click();
    //     Promise.all([mo.getRowContent("Volume"), mo.getRowContent("Number"), mo.getRowContent("OJS: Journal Code")])
    //         .then(cells => {
    //             cells[0].element(by.css("input")).sendKeys("2018");
    //             cells[1].element(by.css("input")).sendKeys("18");
    //             cells[2].all(by.css("option")).get(0).click();
    //             message.clearMessages();
    //             e.publish.uploadBtn.click();
    //             message.waitForMessage().then(() => {
    //                 expect(message.getClassOfMain()).toEqual("success");
    //             });
    //         });
    // });

});