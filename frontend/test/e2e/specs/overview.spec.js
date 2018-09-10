const e = require("../modules/elements");
const a = require('../modules/actions');
const ot = require('../modules/overview_table');

describe('overview page', () => {

    /**
     * to test thumbnail generation we need to check similarity of images (and not just compare bytecode)
     * because pdf.js does create slightly different result ins different environments
     */

    it('should show the first page of loaded Document as thumbnail', done => {
        ot.goToOverview(2)
            .then(() => ot.compareThumbnailWithImage(0, "doc1_p1.png"))
            .then(difference => {
                expect(difference).toBeLessThan(1500);
                done()
            });
    });

    it('should update thumbnail if page changes', done => {
        ot.goToOverview(2)
            .then(() => ot.getCell(0, "Range of Pages"))
            .then(cell => cell.all(by.css('input')))
            .then(input => input[0].sendKeys("3"))
            .then(() => ot.compareThumbnailWithImage(0, "doc1_p13.png"))
            .then(difference => {
                a.scrollTo(element(by.css('.thumbnail-container ')));
                expect(difference).toBeLessThan(1500);
                done()
            });
    });

    it('should update thumbnail if document changes', done => {
        ot.goToOverview(3);
        e.overview.columnsDropdownBtn.click();
        e.overview.columnsDropdown.element(by.cssContainingText("label", "Loaded File")).click();
        e.overview.columnsDropdownBtn.click();
        ot.getCell(0, "Loaded File").then(cell => {
            cell.all(by.css('select option')).get(2).click();
            e.overview.columnsDropdownBtn.click();
            e.overview.columnsDropdownList.get(0).click();
            e.overview.columnsDropdownList.get(2).click();
            e.overview.columnsDropdownBtn.click();
            browser.sleep(1500);
            ot.compareThumbnailWithImage(0, "doc3_p1.png").then(difference => {
                expect(difference).toBeLessThan(1500);
                done()
            });
        });
    });

    it('should complain on missing title', () => {
        let titleCell;
        ot.goToOverview(2)
            .then(() => ot.getCell(0, "Title"))
            .then(cell => {
                titleCell = cell;
                expect(titleCell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeFalsy();
                return titleCell;
            })
            .then(cell => cell.all(by.css('input')))
            .then(input => input[0].clear())
            .then(() =>{
                expect(titleCell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeTruthy();
            });
    });

    it('should complain on missing surname (but not on missing first name)', () => {
        let titleCell;
        ot.goToOverview(2)
            .then(() => ot.getCell(0, "Author"))
            .then(cell => {
                titleCell = cell;
                expect(titleCell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeFalsy();
                return titleCell;
            })
            .then(cell => cell.all(by.css('input')))
            .then(input => input[1].clear())
            .then(() =>{
                expect(titleCell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeTruthy();
            });
    });

    it('should add and remove authors', () => {
        let titleCell;
        ot.goToOverview(2)
            .then(() => ot.getCell(0, "Author"))
            .then(cell => {titleCell = cell; return titleCell})
            .then(cell => cell.all(by.css('.btn')))
            .then(input => input[1].click())
            .then(() => {
                expect(titleCell.all(by.css('input')).count()).toEqual(4);
                expect(titleCell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeTruthy();
            })
            .then(() => titleCell.all(by.css('.btn')))
            .then(input => input[1].click())
            .then(input => {
                expect(titleCell.all(by.css('input')).count()).toEqual(2);
                expect(titleCell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeFalsy();
            })
    });

    it('should update table row order on click', () => {
        const titleDoc1 = "PII: 0003-9969(92)90087-O";
        const titleDoc2 = "UNITED";
        ot.goToOverview(3);
        expect(ot.getRowTitle(0)).toEqual(titleDoc1);
        expect(ot.getRowTitle(1)).toEqual(titleDoc2);
        ot.getRowButton(0, 'down').click();
        expect(ot.getRowTitle(0)).toEqual(titleDoc2);
        expect(ot.getRowTitle(1)).toEqual(titleDoc1);
    });

    xit('should open pdf in other tab on btn click', () => { // see #9363
        ot.goToOverview(2);
        ot.getRowButton(0, 'open').click();
        a.switchToNewTab().then(() => {
            browser.ignoreSynchronization = true;
            expect(browser.getCurrentUrl()).toMatch(/\/staging\/e2e-testing\.pdf/);
            browser.ignoreSynchronization = false;
        });
    });

    it('should merge two documents on btn click', () => {
        const testDocFileName = "test-directory/pdf2.pdf";
        ot.goToOverview(3);
        ot.getRowButton(0, 'merge').click();
        ot.getRowButton(1, 'merge').click();
        browser.switchTo().alert().accept();
        expect(e.overview.tableRows.count()).toEqual(2);
        e.overview.columnsDropdownBtn.click();
        e.overview.columnsDropdown.element(by.cssContainingText("label", "Attached Files/Pages")).click();
        e.overview.columnsDropdownBtn.click();
        ot.getCell(0, "Attached").then(cell => {
            expect(cell.all(by.css('td')).first().getText()).toEqual(testDocFileName);
        });
    });

    it('hide and show columns', () => {
        ot.goToOverview(2);
        ot.getVisibleColumnNames().then(columns => {
            expect(columns.indexOf("Title")).not.toEqual(-1);
        });
        e.overview.columnsDropdownBtn.click();
        e.overview.columnsDropdownList.get(0).click();
        e.overview.columnsDropdownBtn.click();
        ot.getVisibleColumnNames().then(columns => {
            expect(columns.indexOf("Title")).toEqual(-1);
        });
    });

});