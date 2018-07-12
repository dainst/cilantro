const e = require("../util/elements");
const action = require('../modules/actions');
const message = require('../modules/messages');
const ot = require('../modules/overview_table');

describe('overview page', () => {

    /**
     * to test thumbnail generation we need to check similarity of images (and not just compare bytecode)
     * because pdf.js does create slightly different result ins different environments
     */

    it('should show the first page of loaded Document as thumbnail', done => {
        ot.goToOverview()
            .then(() => ot.compareThumbnailWithImage(0, "doc1_p1.png"))
            .then(difference => {
                expect(difference).toBeLessThan(1500);
                done()
            });
    });

    it('should update thumbnail if page changes', done => {
        ot.goToOverview()
            .then(() => ot.getCell(0, "Range of Pages"))
            .then(cell => cell.all(by.css('input')))
            .then(input => input[0].sendKeys("3"))
            .then(() => ot.compareThumbnailWithImage(0, "doc1_p13.png"))
            .then(difference => {
                expect(difference).toBeLessThan(1500);
                done()
            });
    });

    xit('should update if document changes', () => {

    });

    it('complain on missing title', () => {
        let titleCell;
        ot.goToOverview()
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

    it('complain on missing surname (but not on missing first name)', () => {
        let titleCell;
        ot.goToOverview()
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

    it('add and remove authors', () => {
        let titleCell;
        ot.goToOverview()
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
                expect(titleCell.element(by.css('.alert.alert-warning')).isDisplayed()).toBeTruthy();
            })
    });
});