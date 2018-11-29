const e = require("../modules/elements");
const a = require("../modules/actions");
const EC = protractor.ExpectedConditions;

const LoginHelper = function () {
    this.get = (browser, destination, user='test_user', password='test_password') => new Promise((resolve, reject) => {
        browser.get(destination).then(() => {
            a.clickNavbarButton('loginBtn');
            e.loginModal.username.clear().sendKeys(user);
            e.loginModal.password.clear().sendKeys(password);
            e.loginModal.login.click();
            browser.wait(EC.invisibilityOf(e.loginModal.login)).then(resolve);

        })
    })
};

module.exports = new LoginHelper();
