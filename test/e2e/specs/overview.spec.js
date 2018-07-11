const e = require("../util/elements");
const action = require('../modules/actions');
const message = require('../modules/messages');
const ot = require('../modules/overview_table');

describe('overview page', () => {

    /**
     * to test thumbnail generationw e need to check similarity of images (and not just compare bytecode)
     * because pdf.js does create slightly different result ins different environments
     */

    it('show the first page of loaded Document as thumbnail', done =>
        ot.goToOverview()
            .then(ot.compareThumbnailWithImage(0, "doc1_p1.png")
                .then(xx => {expect(xx).toBeLessThan(1500); done()}))
    );

    xit('should display another thumbnail if page changes', () => {

    });

    xit('should display another thumbnail if document changes', () => {

    });

    xit('should display another thumbnail if document offset changes', () => {

    });

});