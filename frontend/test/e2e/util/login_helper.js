const e = require("../modules/elements");
const a = require("../modules/actions");
const EC = protractor.ExpectedConditions;

const LoginHelper = function () {
    this.get = (browser, destination) => new Promise((resolve, reject) => {
        browser.get(destination).then(() => {
            a.clickNavbarButton('loginBtn');
            e.loginModal.username.clear().sendKeys('test_user');
            e.loginModal.password.clear().sendKeys('test_password');
            e.loginModal.login.click();
            browser.wait(EC.invisibilityOf(e.loginModal.login)).then(resolve);

        })
    })
};

module.exports = new LoginHelper();
