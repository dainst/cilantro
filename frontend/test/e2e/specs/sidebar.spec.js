const e = require("../modules/elements");
const a = require("../modules/actions");

describe('sidebar', () => {
    it('should switch between tabs'), () => {
        browser.get(browser.baseUrl)
            .then(e.home.startBtn.click);
        expect(e.sidebar.tabBtns.get(1).getText()).toBe("Help");
    }
}