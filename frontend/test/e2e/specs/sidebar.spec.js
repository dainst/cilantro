const e = require("../modules/elements");
const a = require("../modules/actions");

describe('sidebar', () => {
    it('should switch between tabs', () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click);
        expect(e.sidebar.data.isDisplayed()).toBeFalsy();
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