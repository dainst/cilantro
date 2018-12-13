const e = require("../modules/elements");
const a = require("../modules/actions");
const users = require("../settings/users")
const EC = protractor.ExpectedConditions;

const LoginHelper = function () {
    this.get = (browser, destination, userTestId='normal') => new Promise((resolve, reject) => {
        browser.get(destination).then(() => {
            a.clickNavbarButton('loginBtn');



            e.loginModal.username.clear().sendKeys(users[userTestId].username);
            e.loginModal.password.clear().sendKeys(users[userTestId].password);
            e.loginModal.login.click();
            browser.wait(EC.invisibilityOf(e.loginModal.login)).then(resolve);

        })
    })
};

module.exports = new LoginHelper();
