const e = require("../util/elements");
const a = require('../modules/actions');
const so = require('../modules/subobject');
const mo = require('../modules/mainobject');
const message = require('../modules/messages');
const EC = protractor.ExpectedConditions;


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
        mo.getRowContent("Volume").then(cell => {
            cell.element(by.css("input")).sendKeys("2018");
        });
        mo.getRowContent("Number").then(cell => {
            cell.element(by.css("input")).sendKeys("18");
        });
        mo.getRowContent("OJS: Journal Code").then(cell => {
            cell.all(by.css("option")).get(2).click();
        });
        expect(e.publish.uploadBtn.isDisplayed()).toBeTruthy();
    });

    it ("should start job if everything is okay", () => {
        so.goToSubObject(2);
        e.subobject.confirmBtn.click();
        mo.getRowContent("Volume").then(cell => {
            cell.element(by.css("input")).sendKeys("2018");
        });
        mo.getRowContent("Number").then(cell => {
            cell.element(by.css("input")).sendKeys("18");
        });
        mo.getRowContent("OJS: Journal Code").then(cell => {
            cell.all(by.css("option")).get(2).click();
        });
        message.clearMessages();
        e.publish.uploadBtn.click();
        e.publish.uploadBtn.click(); // it needs two clicks, reason unknown atm
        expect(message.getClassOfMain()).toEqual("success");
    });

});