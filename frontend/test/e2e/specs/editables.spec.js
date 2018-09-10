const so = require('../modules/subobject');
const mo = require('../modules/mainobject');
const e = require("../modules/elements");
const message = require('../modules/messages');
const documents = require('../modules/documents');

describe('subobject view', () => {

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
            browser.get(browser.baseUrl);
            mo.getRowContent("OJS: Journal Code").then(cell => {
                cell.all(by.css("option")).get(1).click();
                e.home.startBtn.click();
                e.documents.treeViewItemsTopLevel.get(2).all(by.css('.load')).first().click();
                documents.waitForLoaded(2).then(() => {
                    e.documents.proceedBtn.click();
                    e.overview.proceedBtn.click();
                    so.getRowContent("Language").then(cell => {
                        expect(cell.all(by.css("label")).get(0).getText()).toBe("English");
                    });
                });
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

    describe('Range of Pages', () => {
        it('should complain if starting page is missing', () => {
            so.goToSubObject(2);
            so.getRowContent("Range of Pages").then(cell => {
                const startPage = cell.all(by.css("input")).get(0);
                startPage.clear();
                expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
            });
        });

        it('should update index-representation of page numbers if page boundaries change, as long as it it not entered manually', () => {
            so.goToSubObject(2);
            so.getRowContent("Range of Pages").then(cell => {
                const startPage = cell.all(by.css("input")).get(0);
                const endPage = cell.all(by.css("input")).get(1);
                const indexRep = cell.all(by.css("input")).last();
                startPage.clear().sendKeys("3");
                endPage.clear().sendKeys("9");
                expect(indexRep.getAttribute("value")).toEqual("3–9");
                indexRep.sendKeys("xxx");
                startPage.clear().sendKeys("4");
                expect(indexRep.getAttribute("value")).toEqual("3–9xxx");
            });
        });

        it('should update index-representation of page numbers if file offset was changed', () => {
            so.goToSubObject(2);
            so.getRowContent("Loaded File").then(loadedFileCell => {
                const docOffset = loadedFileCell.all(by.css("input")).last();
                so.getRowContent("Range of Pages").then(cell => {
                    const startPage = cell.all(by.css("input")).get(0);
                    const endPage = cell.all(by.css("input")).get(1);
                    const indexRep = cell.all(by.css("input")).last();
                    docOffset.clear().sendKeys(3);
                    startPage.clear().sendKeys("3");
                    endPage.clear().sendKeys("9");
                    expect(indexRep.getAttribute("value")).toEqual("6–12");
                });
            });
        });

        it('should allow page boundaries change as printed in index if document offset is set', () => {
            so.goToSubObject(2);
            so.getRowContent("Loaded File").then(loadedFileCell => {
                const docOffset = loadedFileCell.all(by.css("input")).last();
                so.getRowContent("Range of Pages").then(cell => {
                    const startPage = cell.all(by.css("input")).get(0);
                    const startPagePrinted = cell.all(by.css("input")).get(2);
                    docOffset.clear().sendKeys(3);
                    startPagePrinted.clear().sendKeys("4");
                    expect(startPage.getAttribute("value")).toEqual("1");
                    startPage.clear().sendKeys("2");
                    expect(startPagePrinted.getAttribute("value")).toEqual("5");
                });
            });
        });

        it('should complain about impossible page boundaries', () => {
            so.goToSubObject(2);
            so.getRowContent("Loaded File").then(loadedFileCell => {
                const docOffset = loadedFileCell.all(by.css("input")).last();
                so.getRowContent("Range of Pages").then(cell => {
                    const endPagePrinted = cell.all(by.css("input")).get(3);
                    docOffset.clear().sendKeys(5);
                    endPagePrinted.clear().sendKeys("33");
                    expect(cell.element(by.css(".alert-warning")).isDisplayed()).toBeTruthy();
                });
            });
        });


        it('should change page boundaries if a file with different offset is chosen', () => {
            so.goToSubObject(3);
            so.getRowContent("Loaded File").then(loadedFileCell => {
                const docOffset = loadedFileCell.all(by.css("input")).last();
                so.getRowContent("Range of Pages").then(cell => {
                    const startPage = cell.all(by.css("input")).get(0);
                    const endPage = cell.all(by.css("input")).get(1);
                    const indexRep = cell.all(by.css("input")).last();

                    docOffset.clear().sendKeys(1);
                    startPage.clear().sendKeys(1);
                    endPage.clear().sendKeys(2);
                    expect(indexRep.getAttribute("value")).toEqual("2–3");

                    loadedFileCell.element(by.css('[value="test-directory/pdf3.pdf"]')).click();

                    expect(indexRep.getAttribute("value")).toEqual("1–2");
                });
            });
        });

    });

});