const e = require("../modules/elements");
const a = require('../modules/actions');
const ot = require('../modules/overview_table');

describe('login dialog', () => {

    beforeEach(done => {
        browser.driver.manage().deleteAllCookies().then();
        browser.get(browser.baseUrl)

            .then(() => {

                a.clickNavbarButton('loginBtn');

            }).then(done);
    });

    it('login with correct credentials', () => {
        e.loginModal.username.clear().sendKeys('test_user');
        e.loginModal.password.clear().sendKeys('test_password');
        e.loginModal.login.click();
        expect(e.navbar.loginBtn.isPresent()).toBe(false);
    });

    it('login with incorrect credentials', () => {
        e.loginModal.username.clear().sendKeys('test');
        e.loginModal.password.clear().sendKeys('apfel');
        e.loginModal.login.click();
        expect(e.loginModal.errorMessage.isPresent()).toBe(true);
    });

});