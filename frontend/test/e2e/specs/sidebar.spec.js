const e = require("../modules/elements");
const a = require("../modules/actions");
const LoginHelper = require("../util/login_helper");

describe('sidebar', () => {

    xit('should switch between tabs', () => {
        LoginHelper.get(browser, browser.baseUrl)
            .then(e.home.importJournal.click)
            .then(e.home.startBtn.click);
        e.sidebar.help.click();
        expect(e.sidebar.data.isDisplayed()).toBeTruthy();
        expect(e.sidebar.help.isDisplayed()).toBeFalsy();
        e.sidebar.messages.click();
        expect(e.sidebar.data.isDisplayed()).toBeTruthy();
        expect(e.sidebar.help.isDisplayed()).toBeTruthy();
        expect(e.sidebar.messages.isDisplayed()).toBeFalsy();
        e.sidebar.collapseBtn.click();
        expect(e.sidebar.collapseBtn.isDisplayed()).toBeFalsy();
        expect(e.sidebar.sidebar.isDisplayed()).toBeFalsy();
        expect(e.sidebar.data.isDisplayed()).toBeTruthy();
        expect(e.sidebar.help.isDisplayed()).toBeTruthy();
        expect(e.sidebar.messages.isDisplayed()).toBeTruthy();
        e.sidebar.data.click();
        expect(e.sidebar.collapseBtn.isDisplayed()).toBeTruthy();
        expect(e.sidebar.sidebar.isDisplayed()).toBeTruthy();
        expect(e.sidebar.data.isDisplayed()).toBeFalsy();
    });

});
