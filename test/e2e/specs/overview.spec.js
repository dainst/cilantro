const e = require("../util/elements");
const action = require('../modules/actions');
const message = require('../modules/messages');
const ot = require('../modules/overview_table');

describe('overview page', () => {

    beforeEach(done =>
        browser.get(browser.baseUrl)
            .then(e.start.startBtn.click)
            .then(e.documents.treeViewItemsTopLevel.get(2).element(by.css('.load')).click)
            .then(message.waitForMessage)
            .then(e.documents.proceedBtn.click)
            .then(done)
    );

    // chrome only!
    const thumbStartTestDoc1P1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA3wAAATuCAYAAACWHSHkAAAABHNCSVQICA";

    it('should display a thumbnail', () => expect(ot.getThumbnailBinaryStart(0)).toEqual(thumbStartTestDoc1P1));

    xit('should display another thumbnail if page changes', () => {

    });

    xit('should display another thumbnail if document changes', () => {

    });

    xit('should display another thumbnail if document offset changes', () => {

    });

});