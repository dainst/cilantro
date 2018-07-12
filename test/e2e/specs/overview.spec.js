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
            .then(page => page[0].sendKeys("3"))
            .then(() => ot.compareThumbnailWithImage(0, "doc1_p13.png"))
            .then(difference => {
                expect(difference).toBeLessThan(1500);
                done()
            });
    });

    xit('should update if document changes', () => {

    });

});