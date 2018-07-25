const e = require("../util/elements");
const action = require('../modules/actions');
const message = require('../modules/messages');
const so = require('../modules/subobject');

describe('subobject view', () => {
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