const e = require("../util/elements");
const action = require('../modules/actions');
const message = require('../modules/messages');
const so = require('../modules/subobject');

fdescribe('subobject view', () => {

    describe('base editable', () => {
        it('should complain on missing title', () => {
            so.goToSubObject(3);
            so.getRowContent("Title").then(
                cell => {
                    const input = cell.element(by.css("input"));
                    expect(input.getAttribute("value")).toEqual("PII: 0003-9969(92)90087-O");
                    input.clear();
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
                }
            );
        });
    });

    describe('date editable', () => {
        it('should complain on wrong date of publishing', () => {
            so.goToSubObject(3);
            so.getRowContent("Date of Publishing").then(
                cell => {
                    const inputYear = cell.all(by.css("input")).get(0);
                    const inputMonth = cell.all(by.css("input")).get(1);
                    const inputDay = cell.all(by.css("input")).get(2);
                    inputYear.clear();
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
                    inputYear.sendKeys("2018");
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeFalsy();
                    inputYear.clear().sendKeys("ABC");
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
                    inputYear.clear().sendKeys("2015");
                    inputMonth.clear().sendKeys("18");
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
                    inputMonth.clear().sendKeys("11");
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeFalsy();
                    inputDay.clear().sendKeys("50");
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
                    inputDay.clear().sendKeys("5");
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeFalsy();
                }
            );
        });
    });

    describe('language editable', () => {
        it('should show the languages of the journal', () => {
            so.goToSubObject(3);
            so.getRowContent("Language").then(cell => {
                expect(cell.all(by.css("label")).get(0).getText()).toBe("German");
                expect(cell.all(by.css("label")).get(1).getText()).toBe("English");
                expect(cell.all(by.css("label")).get(2).getText()).toBe("French");
                expect(cell.all(by.css("label")).get(3).getText()).toBe("Italian");
                expect(cell.all(by.css("label")).get(4).getText()).toBe("Spanish");
            });
        });

        it('should change to the right language code when clicking a language', () => {
            so.goToSubObject(3);
            so.getRowContent("Language").then(cell => {
                cell.all(by.css("label")).get(3).click();
                expect(cell.element(by.css('input[type="text"]')).getAttribute("value")).toBe("it_IT");
            });
        });

        it('should change to the right language code when clicking a language', () => {
            so.goToSubObject(3);
            so.getRowContent("Language").then(cell => {
                cell.all(by.css("label")).get(3).click();
                expect(cell.element(by.css('input[type="text"]')).getAttribute("value")).toBe("it_IT");
            });
        });

        it('should complain if wrong code was entered', () => {
            so.goToSubObject(3);
            so.getRowContent("Language").then(cell => {
                cell.element(by.css('input[type="text"]')).clear().sendKeys("xxx");
                expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
            });
        });
    });


});