const e = require("../modules/elements");
const a = require('../modules/actions');
const so = require('../modules/subobject');
const mo = require('../modules/mainobject');
const message = require('../modules/messages');


describe('publish page', () => {

    it ("should not allow start job if no articles are staged", () => {
        so.goToSubObject(2);
        a.toggleNavbar();
        expect(e.navbar.publish.isDisplayed()).toBeFalsy();
        a.toggleNavbar();
        e.subobject.confirmBtn.click();
        a.toggleNavbar();
        expect(e.navbar.publish.isDisplayed()).toBeTruthy();
    });

    it ("should not allow start job if mainobject data is no valid", () => {
        so.goToSubObject(2);
        e.subobject.confirmBtn.click();
        expect(e.publish.uploadBtn.isPresent()).toBeFalsy();
        Promise.all([mo.getRowContent("Volume"), mo.getRowContent("Number"), mo.getRowContent("OJS: Journal Code")])
            .then(cells => {
                cells[0].element(by.css("input")).sendKeys("2018");
                cells[1].element(by.css("input")).sendKeys("18");
                cells[2].all(by.css("option")).get(1).click();
                expect(e.publish.uploadBtn.isPresent()).toBeTruthy();
            });
    });

    it("should start job if everything is okay", () => {
        so.goToSubObject(2);
        e.subobject.confirmBtn.click();
        Promise.all([mo.getRowContent("Volume"), mo.getRowContent("Number"), mo.getRowContent("OJS: Journal Code")])
            .then(cells => {
                cells[0].element(by.css("input")).sendKeys("2018");
                cells[1].element(by.css("input")).sendKeys("18");
                cells[2].all(by.css("option")).get(1).click();
                message.clearMessages();
                e.publish.uploadBtn.click();
                message.waitForMessage().then(() => {
                    expect(message.getClassOfMain()).toEqual("success");
                });
            });
    });

});