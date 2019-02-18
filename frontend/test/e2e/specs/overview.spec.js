const e = require("../modules/elements");
const a = require('../modules/actions');
const ot = require('../modules/overview_table');
const EC = protractor.ExpectedConditions;


describe('overview page', () => {

    /**
     * to test thumbnail generation we need to check similarity of images (and not just compare bytecode)
     * because pdf.js does create slightly different result ins different environments
     */

    it('should show the first page of loaded Document as thumbnail', done => {
        ot.goToOverview(2);
        browser.wait(EC.visibilityOf(e.overview.tableRows.get(0)), 2000);
        ot.compareThumbnailWithImage(0, "doc1_p1.png")
            .then(difference => {
                expect(difference).toBeLessThan(1500);
                done();
            });
    });

    it('should update thumbnail if page changes', done => {
        ot.goToOverview(2);
        browser.wait(EC.visibilityOf(e.overview.tableRows.get(0)), 2000);
        ot.getCell(0, "Range of Pages")
            .then(cell => cell.all(by.css('input')))
            .then(input => {
                input[0].clear().sendKeys("13");
                browser.sleep(1000);
                ot.compareThumbnailWithImage(0, "doc1_p13.png")
                    .then(difference => {
                        a.scrollTo(element(by.css('.thumbnail-container ')));
                        expect(difference).toBeLessThan(8000); //Image is off by 1 px it seems ?
                        done();
                    });
            })
    });

    it('should update thumbnail if document changes', done => {
        ot.goToOverview(3);
        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 5000);
        e.overview.columnsDropdownBtn.click();
        e.overview.columnsDropdown.element(by.cssContainingText("label", "Loaded File")).click();
        e.overview.columnsDropdownBtn.click();
        ot.getCell(0, "Loaded File").then(cell => {
            cell.all(by.css('select option')).get(2).click();
            browser.sleep(2000);
            ot.compareThumbnailWithImage(0, "doc3_p1.png").then(difference => {
                expect(difference).toBeLessThan(1500);
                done();
            });
        });
    });

    it('should complain on missing title', () => {
        let titleCell;
        ot.goToOverview(2);

        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 2000);
        ot.getCell(0, "Title")
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
        // Failed Travis once :  Expected true to be falsy.
        let titleCell;
        ot.goToOverview(2);
        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 2000);
        ot.getCell(0, "Author")
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
        ot.goToOverview(2);
        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 2000);
        ot.getCell(0, "Author").then(cell => {
            cell.all(by.css('.btn')).get(1).click();
            browser.wait(EC.visibilityOf(cell.element(by.css('.alert.alert-warning'))), 2000);
            expect(cell.all(by.css('input')).count()).toEqual(4);
            cell.all(by.css('.btn')).get(1).click();
            expect(cell.all(by.css('input')).count()).toEqual(2);
            expect(cell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeFalsy();
        });
    });

    it('should update table row order on click', () => {
        const titleDoc1 = "PII: 0003-9969(92)90087-O";
        const titleDoc2 = "UNITED";
        ot.goToOverview(3);
        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 5000);
        expect(ot.getRowTitle(0)).toEqual(titleDoc1);
        expect(ot.getRowTitle(1)).toEqual(titleDoc2);
        ot.getRowButton(0, 'down').click();
        expect(ot.getRowTitle(0)).toEqual(titleDoc2);
        expect(ot.getRowTitle(1)).toEqual(titleDoc1);
    });

    xit('should open pdf in other tab on btn click', () => {
    // @TODO Travis crashes on this test.
        ot.goToOverview(2);
        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 5000);
        ot.getRowButton(0, 'open').click();
        browser.sleep(1000);
        a.switchToNewTab().then(() => {
            //browser.ignoreSynchronization = true;
            expect(browser.driver.getCurrentUrl()).toMatch(/\/staging\/e2e-testing\.pdf/);
            browser.sleep(1000);
            //browser.ignoreSynchronization = false;
        }).then(() => {
            a.closeTab();
        });
    });

    xit('should merge two documents on btn click', () => {
        const testDocFileName0 = "test-directory/pdf2.pdf";
        const testDocFileName2 = "test-directory/pdf3.pdf";
        ot.goToOverview(3);

        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 10000);

        e.overview.sortByBtn.click();
        e.overview.sortByDropdown.element(by.cssContainingText('a',"Title (descending)")).click();
        e.overview.sortByBtn.click();

        e.overview.addBtn.click();
        for(var i=0; i < 3; i++){
            ot.getRowButton(0, 'merge').click();
            ot.getRowButton(1, 'merge').click();
            browser.switchTo().alert().accept();
            expect(e.overview.tableRows.count()).toEqual(3-i);
        }

        e.overview.columnsDropdownBtn.click();
        e.overview.columnsDropdown.element(by.cssContainingText("label", "Attached Files/Pages")).click();
        e.overview.columnsDropdownBtn.click();
        expect(e.attachedList.cells.get(1).getText()).toEqual(testDocFileName2);
        expect(e.attachedList.cells.get(2).getText()).toEqual(testDocFileName0);

        e.attachedList.cells.get(1).click();
        e.attachedList.moveDown.get(0).click();
        expect(e.attachedList.cells.get(1).getText()).toEqual(testDocFileName0);
        expect(e.attachedList.cells.get(2).getText()).toEqual(testDocFileName2);

        e.attachedList.moveDown.get(0).click();
        expect(e.attachedList.cells.get(2).getText()).toEqual(testDocFileName2);

        e.attachedList.moveUp.get(0).click();
        expect(e.attachedList.cells.get(1).getText()).toEqual(testDocFileName2);
        expect(e.attachedList.cells.get(2).getText()).toEqual(testDocFileName0);

        e.attachedList.cells.get(0).click();
        e.attachedList.detach.get(0).click();
        expect(e.attachedList.cells.get(0).getText()).toEqual(testDocFileName2);
        expect(e.attachedList.cells.get(1).getText()).toEqual(testDocFileName0);
        expect(e.attachedList.cells.count()).toEqual(2);

        e.attachedList.detach.get(0).click();
        expect(e.attachedList.cells.get(0).getText()).toEqual(testDocFileName0);
    });

    it('hide and show columns', () => {
        ot.goToOverview(2);
        browser.wait(EC.visibilityOf(e.overview.columnsDropdownBtn), 5000);
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
